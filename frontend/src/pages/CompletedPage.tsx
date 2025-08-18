import { useEffect, useState } from "react";
import { LuCircle } from "react-icons/lu";
import { RiDraggable } from "react-icons/ri";
import { SlArrowDown } from "react-icons/sl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { HiOutlineDotsVertical } from "react-icons/hi";

// API Task type
type Task = {
  id: number;
  title: string;
  description: string;
  project: { id: number; name: string } | null;
  dueDate: string;
  IsCompleted: boolean;
};

// Grouped by formatted date
type TasksByDate = Record<string, Task[]>;

export default function Completed() {
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [isOpen, setIsOpen] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<string[]>([]);
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({});
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<number | null>(null);

  // Fetch completed tasks
  useEffect(() => {
    fetch("https://localhost:5021/api/tasks/completed")
      .then((res) => res.json())
      .then((data: Task[]) => {
        const projectNames = Array.from(new Set(data.map((t) => t.project?.name).filter((name): name is string => !!name)));
        setCompletedProjects(projectNames);

        const grouped: TasksByDate = {};
        data.forEach((task) => {
          const date = new Date(task.dueDate);
          const key = `${date.getDate()} ${date.toLocaleString("default", {
            month: "long",
          })} - ${date.toLocaleString("default", { weekday: "long" })}`;
          grouped[key] = grouped[key] || [];
          grouped[key].push(task);
        });

        setTasksByDate(grouped);
      })
      .catch((err) => console.error("Failed to fetch tasks:", err));
  }, []);

  // Drag & drop handler
  const handleDragEnd = (result: DropResult, section: string) => {
    if (!result.destination) return;
    const items = Array.from(tasksByDate[section]);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTasksByDate({ ...tasksByDate, [section]: items });
  };

  // Delete task
  const deleteTask = async (taskId: number) => {
    setTasksByDate((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        updated[key] = updated[key].filter((t) => t.id !== taskId);
      }
      return updated;
    });
    setMenuOpenTaskId(null);
    try {
      await fetch(`https://localhost:5021/api/tasks/${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // Task item
  const TaskItem = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="group relative flex items-start gap-2 py-2">
          <span className="absolute top-0 right-0 w-[97%] h-px bg-gray-200" />
          <RiDraggable className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move" />
          <LuCircle className="h-4 w-4 text-gray-500 stroke-1" />

          <article className="flex-1">
            <header className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-500">{task.title}</h3>

              <div className="relative">
                <button onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)} className="p-1 hover:bg-gray-100 rounded-full">
                  <HiOutlineDotsVertical className="w-5 h-5 text-gray-500" />
                </button>

                {menuOpenTaskId === task.id && (
                  <ul className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-50">
                    {/* Edit button */}
                    <li className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer">Edit</li>

                    {/* Delete button */}
                    <li className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm text-red-500" onClick={() => deleteTask(task.id)}>
                      Delete
                    </li>
                  </ul>
                )}
              </div>
            </header>

            <p className="text-xs text-gray-500">{task.description}</p>
            <footer className="flex justify-end">
              <small className="text-xs text-gray-400">{task.project?.name ?? "No Project"}</small>
            </footer>
          </article>
        </li>
      )}
    </Draggable>
  );

  // Section filtered by selected project
  const TaskSection = ({ title }: { title: string }) => {
    const tasks = tasksByDate[title].filter((task) => selectedProject === "All Projects" || task.project?.name === selectedProject);
    if (tasks.length === 0) return null;

    return (
      <section className="mb-4">
        <h2 className="font-medium text-sm px-10 mb-2">{title}</h2>
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, title)}>
          <Droppable droppableId={title}>
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {tasks.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </section>
    );
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      {/* Header */}
      <header className="mb-4 px-10 flex items-center gap-1 relative">
        <h1 className="text-2xl font-bold">Activity:</h1>

        <div className="relative">
          <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="flex items-center gap-2 text-2xl font-bold px-1 cursor-pointer">
            <span className="text-gray-900">{selectedProject}</span>
            <SlArrowDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-auto">
              <li
                className={`px-3 py-2 cursor-pointer text-sm font-medium hover:bg-gray-100 ${selectedProject === "All Projects" ? "text-gray-900" : "text-gray-500"}`}
                onClick={() => {
                  setSelectedProject("All Projects");
                  setIsOpen(false);
                }}
              >
                # All Projects
              </li>
              {completedProjects.map((project) => (
                <li
                  key={project}
                  className={`px-3 py-2 cursor-pointer text-sm font-medium hover:bg-gray-100 ${selectedProject === project ? "text-gray-900" : "text-gray-500"}`}
                  onClick={() => {
                    setSelectedProject(project);
                    setIsOpen(false);
                  }}
                >
                  # {project}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      {/* Render Sections */}
      {Object.keys(tasksByDate).map((section) => (
        <TaskSection key={section} title={section} />
      ))}
    </main>
  );
}
