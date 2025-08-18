import { useEffect, useState } from "react";
import { LuCircle } from "react-icons/lu";
import { PiPlusBold, PiPlusCircleFill } from "react-icons/pi";
import { RiDraggable } from "react-icons/ri";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { HiOutlineDotsVertical } from "react-icons/hi";
import AddTaskTodayModal, { type Project } from "../components/modals/AddTaskTodayModal";
import type { Task } from "../features/types";
import { getProjects, getTodayTasks } from "../features/today/todayApi";
import { handleDragEnd } from "../features/dragUtils";
import { deleteTask, markTaskComplete } from "../features/taskService";
import EditTaskModal from "../components/modals/EditTaskModal";

export default function TodayList() {
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    getTodayTasks().then(setTodayTasks);
    getProjects().then(setProjects);
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

  const handleCompleteTask = (taskId: string) => {
    markTaskComplete(taskId, () => getTodayTasks().then(setTodayTasks));
  };

  const handleDeleteTask = async (taskId: string) => {
    setTodayTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId);
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setShowEditModal(true);
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      {/* Header */}
      <header className="mb-4 px-10">
        <h1 className="text-2xl font-bold mb-4">Today</h1>
        <span className="text-sm font-medium">{todayTasks.length} tasks</span>
      </header>

      {/* Task Section */}
      <section className="mb-4">
        <h2 className="text-sm font-medium px-10 mb-2">Today</h2>

        <DragDropContext onDragEnd={(result) => handleDragEnd(result, todayTasks, setTodayTasks)}>
          <Droppable droppableId="today">
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                {todayTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="group relative flex items-start gap-2 py-2">
                        <span className="absolute top-0 right-0 w-[97%] h-px bg-gray-200" />
                        <RiDraggable className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-move" />

                        <LuCircle className={`... ${task.isCompleted ? "text-green-500" : "text-gray-500 hover:text-red-500"}`} onClick={() => !task.isCompleted && handleCompleteTask(task.id)} />

                        <article className="flex-1 relative">
                          <header className="flex justify-between items-center">
                            <h3 className={`text-sm font-semibold ${task.isCompleted ? "text-gray-300 line-through" : "text-gray-500"}`}>{task.title}</h3>

                            <div className="relative task-menu">
                              <button onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)} className="p-1 hover:bg-gray-100 rounded-full">
                                <HiOutlineDotsVertical className="w-5 h-5 text-gray-500" />
                              </button>

                              {menuOpenTaskId === task.id && (
                                <ul className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded shadow-lg z-50">
                                  {/* Edit button */}{" "}
                                  <li className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer" onClick={() => handleEditClick(task)}>
                                    Edit
                                  </li>
                                  {/* Delete button */}
                                  <li
                                    className="px-3 py-1 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleDeleteTask(task.id)} // Handle task deletion
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
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add Task Modal */}
        {showAddForm ? (
          <div className="pl-8 mt-2">
            <AddTaskTodayModal projects={projects} onClose={() => setShowAddForm(false)} onTaskCreated={() => getTodayTasks().then(setTodayTasks)} />
          </div>
        ) : (
          <div className="flex justify-center mt-2">
            <button onClick={() => setShowAddForm(true)} className="group flex items-center gap-1 px-3 py-2 text-gray-700 transition-colors duration-300">
              <span className="relative w-7 h-7 flex items-center justify-center">
                <PiPlusBold className="absolute w-3 h-3 block group-hover:hidden" />
                <PiPlusCircleFill className="absolute w-4 h-4 hidden group-hover:block fill-red-500" />
              </span>
              <span className="text-sm group-hover:text-red-500">Add Task</span>
            </button>
          </div>
        )}

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
              getTodayTasks().then(setTodayTasks);
            }}
          />
        )}
      </section>
    </main>
  );
}
