import { useState } from "react";
import { LuCircle } from "react-icons/lu";
import { PiPlusBold, PiPlusCircleFill } from "react-icons/pi";
import { RiDraggable } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

// ✅ Types
type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
};

type TasksBySection = Record<string, Task[]>;

export default function TodayList() {
  const [tasksBySection, setTasksBySection] = useState<TasksBySection>({
    "Overdue Tasks": [
      { id: "1", title: "Fix API bug", description: "Resolve authentication issue on login API", project: "Backend Revamp" },
      { id: "2", title: "UI Polish", description: "Improve button hover states on dashboard", project: "UI Redesign" },
    ],
    "5 August - Tuesday": [
      { id: "3", title: "Write Test Cases", description: "Add unit tests for payment module", project: "QA Improvements" },
      { id: "4", title: "Prepare Presentation", description: "Slides for product launch meeting", project: "Marketing" },
    ],
  });

  // ✅ Handle Drag-and-Drop
  const handleDragEnd = (result: DropResult, section: string) => {
    if (!result.destination) return;
    const updated = Array.from(tasksBySection[section]);
    const [movedItem] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, movedItem);
    setTasksBySection({ ...tasksBySection, [section]: updated });
  };

  // ✅ Task Item Component
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

  // ✅ Add Task Button Component
  const AddTaskButton = () => (
    <footer className="relative flex justify-center">
      <span className="absolute top-0 right-0 w-[96%] h-px bg-gray-200"></span>
      <button className="group flex items-center gap-1 px-3 py-2 text-gray-700 transition-colors duration-300">
        <span className="relative w-7 h-7 flex items-center justify-center">
          <PiPlusBold className="absolute w-3 h-3 block group-hover:hidden" />
          <PiPlusCircleFill className="absolute w-4 h-4 hidden group-hover:block fill-red-500" />
        </span>
        <span className="group-hover:text-red-500 text-sm">Add Task</span>
      </button>
    </footer>
  );

  // ✅ Section Component
  const TaskSection = ({ title }: { title: string }) => (
    <section className="mb-4">
      <div className="flex justify-between mb-2 px-1">
        <h2 className="font-medium text-sm px-10">{title}</h2>
        {title === "Overdue Tasks" && (
          <button type="button" className="px-2 py-1 text-sm font-semibold text-red-600 hover:underline">
            Reschedule
          </button>
        )}
      </div>
      <DragDropContext onDragEnd={(result) => handleDragEnd(result, title)}>
        <Droppable droppableId={title}>
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
              {tasksBySection[title].map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <AddTaskButton />
    </section>
  );

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      {/* ✅ Header */}
      <header className="mb-4 px-10">
        <h1 className="mb-4 text-2xl font-bold">Today</h1>
        <span className="font-medium text-sm">{Object.values(tasksBySection).flat().length} tasks</span>
      </header>

      {/* ✅ Render Sections */}
      {Object.keys(tasksBySection).map((section) => (
        <TaskSection key={section} title={section} />
      ))}
    </main>
  );
}
