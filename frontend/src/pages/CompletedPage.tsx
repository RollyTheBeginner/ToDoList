import { useState } from "react";
import { LuCircle } from "react-icons/lu";
import { RiDraggable } from "react-icons/ri";
import { SlArrowDown } from "react-icons/sl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

// ✅ Task Type
type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
};

type TasksByDate = Record<string, Task[]>;

export default function Completed() {
  // ✅ 5 Mock Sections with Tasks
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({
    "1 August - Friday": [
      { id: "1", title: "Database Migration", description: "Migrate to new PostgreSQL server", project: "Backend" },
      { id: "2", title: "Landing Page Fix", description: "Resolve layout issues on Safari", project: "Frontend" },
    ],
    "2 August - Saturday": [
      { id: "3", title: "Content Upload", description: "Upload new blog articles", project: "Marketing" },
      { id: "4", title: "Deploy Patch", description: "Deploy hotfix to production", project: "DevOps" },
    ],
    "3 August - Sunday": [
      { id: "5", title: "Testing Workflow", description: "QA regression tests for v2.3", project: "QA" },
    ],
    "4 August - Monday": [
      { id: "6", title: "Client Feedback", description: "Apply requested UI tweaks", project: "UI/UX" },
      { id: "7", title: "Refactor Code", description: "Improve module structure for maintainability", project: "Development" },
    ],
    "5 August - Tuesday": [
      { id: "8", title: "Performance Audit", description: "Analyze slow endpoints", project: "Backend" },
    ],
  });

  // ✅ Drag Reorder Handler
  const handleDragEnd = (result: DropResult, section: string) => {
    if (!result.destination) return;
    const items = Array.from(tasksByDate[section]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasksByDate({ ...tasksByDate, [section]: items });
  };

  // ✅ Task Item
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


  // ✅ Task Section
  const TaskSection = ({ title }: { title: string }) => (
    <section className="mb-4">
      <div className="mb-2">
        <h2 className="font-medium text-sm px-10">{title}</h2>
      </div>
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, title)}>
        <Droppable droppableId={title}>
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
              {tasksByDate[title].map((task, index) => (
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
      {/* ✅ Header */}
      <header className="mb-4 px-10 flex items-center gap-3">
        <h1 className="text-2xl font-bold">
          Activity: <span className="sr-only">Filter by project</span>
        </h1>
        <nav aria-label="Project Filter">
          <button type="button" className="flex items-center gap-2 text-2xl font-bold cursor-pointer">
            <span>All Project</span>
            <SlArrowDown className="w-4 h-4 text-gray-500" />
          </button>
        </nav>
      </header>

      {/* ✅ Render 5 Mock Sections */}
      {Object.keys(tasksByDate).map((section) => (
        <TaskSection key={section} title={section} />
      ))}
    </main>
  );
}
