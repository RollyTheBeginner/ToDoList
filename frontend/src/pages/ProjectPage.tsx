import { useState } from "react";
import { LuCircle } from "react-icons/lu";
import { PiPlusBold, PiPlusCircleFill } from "react-icons/pi";
import { RiDraggable } from "react-icons/ri";
import { SlArrowDown } from "react-icons/sl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

type Task = { id: string; title: string; description: string; project: string };
type TasksBySection = Record<string, Task[]>;

export default function ProjectPage() {
  const projectName = "Finance Revamp";
  const [sections, setSections] = useState<string[]>(["Capture", "Review", "Complete"]);
  const [tasksBySection, setTasksBySection] = useState<TasksBySection>({
    Capture: [
      { id: "1", title: "Gather Requirements", description: "Collect financial data", project: projectName },
      { id: "2", title: "Design Wireframes", description: "Create UI wireframes", project: projectName },
    ],
    Review: [{ id: "3", title: "Data Validation", description: "Check accuracy of reports", project: projectName }],
    Complete: [{ id: "4", title: "Finalize Dashboard", description: "Implement the final version", project: projectName }],
  });

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const sourceList = Array.from(tasksBySection[source.droppableId]);
    const [moved] = sourceList.splice(source.index, 1);
    const destList = Array.from(tasksBySection[destination.droppableId]);
    destList.splice(destination.index, 0, moved);
    setTasksBySection((prev) => ({
      ...prev,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destList,
    }));
  };

  const TaskItem = ({ task, index }: { task: Task; index: number }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group relative flex items-start gap-2 py-2"
        >
          <span className="absolute top-0 right-0 w-[97%] h-px bg-gray-200"></span>
          <RiDraggable className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move" />
          <LuCircle className="h-4 w-4 text-gray-500 stroke-1" />
          <article className="flex-1">
            <header>
              <h3 className="text-sm font-semibold text-gray-500">{task.title}</h3>
            </header>
            <p className="text-xs text-gray-500">{task.description}</p>
            <footer className="flex justify-end">
              <small className="text-xs text-gray-400">{task.project}</small>
            </footer>
          </article>
        </li>
      )}
    </Draggable>
  );

  const AddTaskButton = ({ section }: { section: string }) => (
    <footer className="relative flex justify-center">
      <span className="absolute top-0 right-0 w-[96%] h-px bg-gray-200"></span>
      <button
        onClick={() => {
          const newTask: Task = {
            id: Date.now().toString(),
            title: `New ${section} Task`,
            description: `Description for ${section}`,
            project: projectName,
          };
          setTasksBySection((prev) => ({ ...prev, [section]: [...prev[section], newTask] }));
        }}
        className="group flex items-center gap-1 px-3 py-2 text-gray-700 transition-colors duration-300 hover:text-red-500"
      >
        <span className="relative w-7 h-7 flex items-center justify-center">
          <PiPlusBold className="absolute w-3 h-3 block group-hover:hidden" />
          <PiPlusCircleFill className="absolute w-4 h-4 hidden group-hover:block fill-red-500" />
        </span>
        <span className="text-sm">Add Task</span>
      </button>
    </footer>
  );

  const SectionAddButton = ({ onClick }: { onClick: () => void }) => (
    <div className="relative flex justify-center items-center mt-6 mb-4 opacity-0 group-hover:opacity-100 transition">
      <span className="absolute top-1/2 left-0 w-full h-px bg-gray-300"></span>
      <button
        onClick={onClick}
        className="relative z-10 bg-white px-4 text-sm text-gray-400 hover:text-red-500 transition"
      >
        Add Section
      </button>
    </div>
  );

  const ProjectSection = ({ title }: { title: string }) => (
    <section className="mb-6 group relative">
      <div className="flex justify-between items-center px-10 mb-2">
        <h2 className="font-medium text-sm">{title}</h2>
      </div>

      <Droppable droppableId={title}>
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 px-10">
            {tasksBySection[title]?.map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      {/* Always visible Add Task */}
      <AddTaskButton section={title} />

      {/* Hover-to-show Add Section */}
      <SectionAddButton onClick={() => handleAddSection()} />
    </section>
  );

  const handleAddSection = () => {
    const name = prompt("Enter new section name:");
    if (name && !sections.includes(name)) {
      setSections((prev) => [...prev, name]);
      setTasksBySection((prev) => ({ ...prev, [name]: [] }));
    }
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      <header className="mb-4 px-10">
        <h1 className="mb-4 text-2xl font-bold">{projectName}</h1>
        <div className="flex justify-between">
          <button className="flex items-center gap-2 px-1 rounded-md hover:bg-gray-100 transition">
            <span className="font-medium text-sm">Overview</span>
            <span className="text-sm">2025</span>
            <SlArrowDown className="w-3 h-3 text-gray-500" />
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={handleDragEnd}>
        {sections.map((section) => (
          <ProjectSection key={section} title={section} />
        ))}
      </DragDropContext>
    </main>
  );
}
