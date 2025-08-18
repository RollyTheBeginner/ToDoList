import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { RiDraggable } from "react-icons/ri";
import { LuCircle } from "react-icons/lu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { markTaskComplete } from "../features/taskService";
import EditTaskModal from "../components/modals/EditTaskModal";
import type { Task } from "../features/types";

export default function OverduePage() {
  const [overdue, setOverdue] = useState<Task[]>([]);
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]); // Define the projects state

  // Fetch overdue tasks
  const fetchTasks = () => {
    fetch("https://localhost:5021/api/tasks/overdue")
      .then((res) => res.json())
      .then((data: Task[]) => {
        const normalized = data.map((t) => ({ ...t, id: t.id.toString() })); // Normalize id to string
        setOverdue(normalized);
      })
      .catch((err) => console.error("Failed to fetch overdue tasks:", err));
  };

  // Fetch projects for editing tasks
  const fetchProjects = () => {
    fetch("https://localhost:5021/api/projects") // Assuming you have an endpoint for projects
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to fetch projects:", err));
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects(); // Fetch projects when component mounts
  }, []);

  // Drag & drop reordering
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(overdue);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setOverdue(reordered);
  };

  // Mark task complete
  const handleCompleteTask = (taskId: string) => {
    markTaskComplete(taskId, fetchTasks);
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    setOverdue((prev) => prev.filter((t) => t.id !== taskId));
    setMenuOpenTaskId(null);
    try {
      await fetch(`https://localhost:5021/api/tasks/${taskId}`, { method: "DELETE" });
    } catch (err) {
      console.error("Failed to delete task:", err);
      fetchTasks(); // fallback reload
    }
  };

  const handleSaveTask = (updatedTask: Task) => {
    setOverdue((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  // Task item component
  const TaskItem = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="group relative flex items-start gap-2 py-2">
          <span className="absolute top-0 right-0 w-[97%] h-px bg-gray-200" />
          <RiDraggable className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move" />

          <LuCircle
            className={`h-4 w-4 stroke-1 cursor-pointer transition-colors duration-200 ${task.isCompleted ? "text-green-500" : "text-gray-500 hover:text-red-500"}`}
            onClick={() => handleCompleteTask(task.id)}
          />

          <article className="flex-1">
            <header className="flex justify-between items-center">
              <h3 className={`text-sm font-semibold ${task.isCompleted ? "text-gray-300 line-through" : "text-gray-500"}`}>{task.title}</h3>

              {/* 3-dot menu */}
              <div className="relative">
                <button onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)} className="p-1 hover:bg-gray-100 rounded-full">
                  <HiOutlineDotsVertical className="w-5 h-5 text-gray-500" />
                </button>

                {menuOpenTaskId === task.id && (
                  <ul className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <li className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer" onClick={() => handleEditClick(task)}>
                      Edit
                    </li>
                    <li className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm text-red-500" onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </li>
                  </ul>
                )}
              </div>
            </header>

            <p className={`text-xs ${task.isCompleted ? "text-gray-300 line-through" : "text-gray-500"}`}>{task.description}</p>
            <footer className="flex justify-end">
              <small className={`text-xs ${task.isCompleted ? "text-gray-300" : "text-gray-400"}`}>{task.project?.name ?? "No Project"}</small>
            </footer>
          </article>
        </li>
      )}
    </Draggable>
  );

  // Overdue section
  const OverdueSection = () => (
    <section className="mb-4">
      <h2 className="font-medium text-sm px-10 mb-2">Overdue Tasks</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="overdue">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
              {overdue.map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      <header className="mb-4 px-10">
        <h1 className="text-2xl font-bold mb-2">Overdue</h1>
        <span className="font-medium text-sm">{overdue.length} tasks</span>
      </header>

      <OverdueSection />

      {showEditModal && taskToEdit && (
        <EditTaskModal
          onClose={() => setShowEditModal(false)}
          taskToEdit={{
            id: Number(taskToEdit.id), // ✅ convert string to number
            title: taskToEdit.title,
            description: taskToEdit.description,
            dueDate: taskToEdit.dueDate,
            priority: Number(taskToEdit.priority), // ✅ convert string to number
            projectId: taskToEdit.projectId,
          }}
          projects={projects}
          onTaskUpdated={(updatedTask: Task) => handleSaveTask(updatedTask)} // still needs fixing below
        />
      )}
    </main>
  );
}
