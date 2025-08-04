import { useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { LuCircle } from "react-icons/lu";
import { PiPlusBold, PiPlusCircleFill } from "react-icons/pi";
import { RiDraggable } from "react-icons/ri";
import { SlArrowDown } from "react-icons/sl";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";

// ✅ Define Task Types
type Task = {
  id: string;
  title: string;
  description: string;
  project: string;
};

type TasksByDate = Record<string, Task[]>;

export default function UpcomingList() {
  const [tasksByDate, setTasksByDate] = useState<TasksByDate>({
    "4 - August - Today - Monday": [
      { id: "1", title: "Finalize Report", description: "Complete the financial report for Q3", project: "Finance" },
      { id: "2", title: "Code Review", description: "Review new feature branch PRs", project: "Dev Team" },
    ],
    "5 August - Tomorrow - Tuesday": [
      { id: "3", title: "Client Call", description: "Discuss roadmap with the client", project: "Partnership" },
      { id: "4", title: "Design Update", description: "Update landing page UI with new assets", project: "UI/UX" },
    ],
    "6 August - Wednesday": [
      { id: "5", title: "Prepare Presentation", description: "Slides for upcoming meeting", project: "Marketing" },
      { id: "6", title: "Backup Server", description: "Schedule server backup at midnight", project: "IT Ops" },
    ],
  });

  // ✅ Handle drag reorder
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
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="group relative flex items-start gap-2 py-2">
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

  // ✅ Add Task Button
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
      <AddTaskButton />
    </section>
  );

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">

      <header className="mb-4 px-10">
        <h1 className="mb-4 text-2xl font-bold">Upcoming</h1>
        <div className="flex justify-between">
          <div className="flex justify-between">
            <button className="flex items-center gap-2 px-1 rounded-md hover:bg-gray-100 transition">
              <span className="font-medium text-sm">August</span>
              <span className="text-sm">2025</span>
              <SlArrowDown className="w-3 h-3 text-gray-500" />
            </button>
          </div>
          <div className="flex items-center bg-white text-sm border border-gray-300 rounded-md">
            <button className="flex items-center justify-center p-1 w-10 sm:w-auto hover:bg-gray-100 transition">
              <HiChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative flex items-center">
              <span className="absolute left-0 top-1/4 h-1/2 w-px bg-gray-300"></span>
              <button className="flex items-center justify-center p-1 px-4 text-gray-700 hover:bg-gray-100 transition">Today</button>
              <span className="absolute right-0 top-1/4 h-1/2 w-px bg-gray-300"></span>
            </div>
            <button className="flex items-center justify-center p-1 w-10 sm:w-auto hover:bg-gray-100 transition">
              <HiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <section aria-labelledby="weekdays" className="mb-6 pl-[3%]">
        <h2 className="sr-only">Week Navigation</h2>
        <div className="flex overflow-x-auto">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
            <button key={day} className="flex items-center justify-center gap-1 flex-1 min-w-[70px] px-3 py-2 border-b border-gray-200 bg-white text-gray-700 text-sm hover:bg-gray-100 transition">
              <span className="font-medium">{day}</span>
              <span className="text-gray-500">{i + 4}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ✅ Render All Sections */}
      {Object.keys(tasksByDate).map((section) => (
        <TaskSection key={section} title={section} />
      ))}
    </main>
  );
}
