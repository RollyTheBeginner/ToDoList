import { forwardRef, useEffect, useRef, useState } from "react";
import { LuCircle } from "react-icons/lu";
import { PiPlusBold, PiPlusCircleFill } from "react-icons/pi";
import { RiDraggable } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import DatePicker from "react-datepicker";
import { HiChevronLeft, HiChevronRight, HiOutlineDotsVertical } from "react-icons/hi";
import { SlArrowDown } from "react-icons/sl";
import "react-datepicker/dist/react-datepicker.css";
import type { Task, TasksByMonth } from "../features/types";
import { deleteTask, markTaskComplete } from "../features/taskService";
import { fetchUpcomingTasks } from "../features/upcoming/service";
import AddTaskModal from "../components/modals/AddTaskModal";
import EditTaskModal from "../components/modals/EditTaskModal";

export default function UpcomingList() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByMonth, setTasksByMonth] = useState<TasksByMonth>({});
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [showAddFormMonth, setShowAddFormMonth] = useState<string | null>(null);
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load tasks and projects
  const loadTasks = async () => {
    try {
      const grouped = await fetchUpcomingTasks();
      setTasksByMonth(grouped);
    } catch (err) {
      console.error("Failed to fetch upcoming tasks:", err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await fetch("https://localhost:5021/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".task-menu")) {
        setMenuOpenTaskId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to selected month section
  useEffect(() => {
    const key = `${selectedDate.toLocaleString("default", { month: "long" })} ${selectedDate.getFullYear()}`;
    const section = monthRefs.current[key];
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedDate]);

  // Task actions
  const handleCompleteTask = (taskId: string, month: string) => {
    setTasksByMonth((prev) => ({
      ...prev,
      [month]: prev[month].filter((t) => t.id !== taskId),
    }));

    markTaskComplete(taskId).catch((err) => {
      console.error("Failed to complete task:", err);
      loadTasks();
    });
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  const handleDragEnd = (result: DropResult, month: string) => {
    if (!result.destination) return;
    const items = Array.from(tasksByMonth[month]);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTasksByMonth((prev) => ({ ...prev, [month]: items }));
  };

  const handleTaskCreated = () => {
    loadTasks();
    setShowAddFormMonth(null);
  };

  // Date navigation
  const goToToday = () => setSelectedDate(new Date());
  const goToPrevDay = () => setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() - 1)));
  const goToNextDay = () => setSelectedDate((prev) => new Date(prev.setDate(prev.getDate() + 1)));

  type CustomButtonProps = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  };

  const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(({ onClick }, ref) => (
    <button onClick={onClick} ref={ref} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition">
      <span className="font-medium text-sm">{selectedDate.toLocaleString("default", { month: "long" })}</span>
      <span className="text-sm">{selectedDate.getFullYear()}</span>
      <SlArrowDown className="w-3 h-3 text-gray-500" />
    </button>
  ));

  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);

  const TaskItem = ({ task, index, month }: { task: Task; index: number; month: string }) => (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="group relative flex items-start gap-2 py-2">
          <span className="absolute top-0 right-0 w-[97%] h-px bg-gray-200" />
          <RiDraggable className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move" />

          <LuCircle
            className={`h-4 w-4 stroke-1 cursor-pointer transition-colors duration-200 ${task.isCompleted ? "text-green-500" : "text-gray-500 hover:text-red-500"}`}
            onClick={() => !task.isCompleted && handleCompleteTask(task.id, month)}
          />

          <article className="flex-1">
            <header className="flex justify-between items-center">
              <h3 className={`text-sm font-semibold ${task.isCompleted ? "text-gray-300 line-through" : "text-gray-500"}`}>{task.title}</h3>

              <div className="relative task-menu">
                <button onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)} className="p-1 hover:bg-gray-100 rounded-full">
                  <HiOutlineDotsVertical className="w-5 h-5 text-gray-500" />
                </button>

                {menuOpenTaskId === task.id && (
                  <ul className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <li className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer" onClick={() => handleEditClick(task)}>
                      Edit
                    </li>
                    <li
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer text-sm text-red-500"
                      onClick={async () => {
                        setTasksByMonth((prev) => ({
                          ...prev,
                          [month]: prev[month].filter((t) => t.id !== task.id),
                        }));
                        setMenuOpenTaskId(null);
                        try {
                          await deleteTask(task.id);
                        } catch (err) {
                          console.error("Failed to delete task:", err);
                          loadTasks();
                        }
                      }}
                    >
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

  const MonthSection = ({ month }: { month: string }) => {
    const tasks = tasksByMonth[month] || [];
    const sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return (
      <section
        ref={(el) => {
          monthRefs.current[month] = el as HTMLDivElement | null;
        }}
        className="mb-6"
      >
        {/* Month Header + Add Button */}
        <div className="mb-2 flex justify-between items-center px-10">
          <h2 className="font-medium text-sm">{month}</h2>

          {showAddFormMonth !== month && (
            <button onClick={() => setShowAddFormMonth(month)} className="group flex items-center gap-1 px-3 py-1 text-gray-700 transition-colors duration-300">
              <span className="relative w-7 h-7 flex items-center justify-center">
                <PiPlusBold className="absolute w-3 h-3 block group-hover:hidden" />
                <PiPlusCircleFill className="absolute w-4 h-4 hidden group-hover:block fill-red-500" />
              </span>
              <span className="text-sm group-hover:text-red-500">Add Task</span>
            </button>
          )}
        </div>

        {/* Add Task Modal */}
        {showAddFormMonth === month && (
          <div className="pl-10 mt-2">
            <AddTaskModal projects={projects} onClose={() => setShowAddFormMonth(null)} onTaskCreated={handleTaskCreated} />
          </div>
        )}

        {/* Task List */}
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, month)}>
          <Droppable droppableId={month}>
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 px-10">
                {sortedTasks.map((task, index) => (
                  <TaskItem key={task.id} task={task} index={index} month={month} />
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
      {/* Page Header */}
      <header className="mb-4 px-10">
        <h1 className="text-2xl font-bold mb-4">Upcoming</h1>

        {/* Date Picker & Navigation */}
        <div className="flex justify-between">
          <DatePicker
            selected={selectedDate}
            onChange={(d) => d && setSelectedDate(d)}
            dateFormat="MMMM d, yyyy"
            customInput={<CustomButton />}
            calendarClassName="!z-50"
            popperPlacement="bottom-start"
          />

          <div className="flex items-stretch bg-white text-sm border border-gray-300 rounded-md overflow-hidden">
            <button onClick={goToPrevDay} className="flex items-center justify-center w-10 hover:bg-gray-100 transition relative">
              <HiChevronLeft className="w-5 h-5 text-gray-600" />
              <span className="absolute right-0 top-1/4 h-1/2 w-px bg-gray-300" />
            </button>

            <button onClick={goToToday} className="flex-1 flex items-center justify-center px-4 hover:bg-gray-100 transition relative">
              Today
              <span className="absolute right-0 top-1/4 h-1/2 w-px bg-gray-300" />
            </button>

            <button onClick={goToNextDay} className="flex items-center justify-center w-10 hover:bg-gray-100 transition">
              <HiChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Weekday Navigation */}
      <section aria-labelledby="weekdays" className="mb-6 pl-[3%]">
        <h2 className="sr-only" id="weekdays">
          Week Navigation
        </h2>
        <div className="flex overflow-x-auto">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
            const d = new Date(selectedDate);
            d.setDate(selectedDate.getDate() - d.getDay() + i);
            const isSelected = d.toDateString() === selectedDate.toDateString();

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 min-w-[70px] px-3 py-2 border-b text-sm transition ${
                  isSelected ? "border-red-500 text-red-500 font-bold" : "border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="font-medium">{day}</span>
                <span className="text-gray-500">{d.getDate()}</span>
              </button>
            );
          })}
        </div>

        {showEditModal && taskToEdit && (
          <EditTaskModal
            onClose={() => setShowEditModal(false)}
            taskToEdit={{
              id: Number(taskToEdit.id),
              title: taskToEdit.title,
              description: taskToEdit.description,
              dueDate: taskToEdit.dueDate,
              priority: Number(taskToEdit.priority),
              projectId: taskToEdit.projectId,
            }}
            projects={projects}
            onTaskUpdated={() => {
              setShowEditModal(false);
            }}
          />
        )}
      </section>

      {/* Monthly Task Sections */}
      {Object.keys(tasksByMonth).map((month) => (
        <MonthSection key={month} month={month} />
      ))}
    </main>
  );
}
