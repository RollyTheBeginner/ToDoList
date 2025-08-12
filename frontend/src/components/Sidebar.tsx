import { useState } from "react";
import { Link } from "react-router-dom";
import { GoCalendar } from "react-icons/go";
import { PiCalendarDotsThin, PiCheckCircleThin, PiNotificationThin, PiPlus, PiPlusCircleFill, PiSidebarSimpleThin } from "react-icons/pi";
import { SlArrowDown } from "react-icons/sl";
import AddTaskModal from "./modals/AddTaskModal";
import myImage from "../assets/images/123.jpg";
import { CiHashtag } from "react-icons/ci";

export default function Sidebar({ onToggle }: { onToggle: () => void }) {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // ✅ Mock Projects
  const [projects, setProjects] = useState<string[]>(["Backend Revamp", "UI Redesign", "Marketing Launch", "QA Automation", "DevOps Pipeline"]);
  const [showProjects, setShowProjects] = useState(true);

  // ✅ Add Project (Mock)
  const handleAddProject = () => {
    const newProject = prompt("Enter new project name:");
    if (newProject) setProjects((prev) => [...prev, newProject]);
  };

  return (
    <>
      <nav className="w-full h-full flex flex-col" aria-label="Sidebar Navigation">
        {/* ✅ User Header */}
        <header className="flex justify-between items-center mb-6">
          <button aria-label="User Menu" className="flex items-center gap-2 pr-1 rounded-b-sm hover:text-red-400 hover:bg-gray-100 transition">
            <img src={myImage} alt="User avatar" className="w-7 h-7 rounded-full object-cover" />
            <span className="text-sm">Rolly</span>
            <SlArrowDown className="w-3 h-3 text-gray-600" />
          </button>
          <div className="flex gap-4">
            <button aria-label="View Notifications">
              <PiNotificationThin className="text-xl hover:text-red-400 transition" />
            </button>
            <button aria-label="Toggle Sidebar" onClick={onToggle}>
              <PiSidebarSimpleThin className="text-xl hover:text-red-400 transition" />
            </button>
          </div>
        </header>

        {/* ✅ Main Navigation */}
        <section aria-label="Main Navigation" className="overflow-y-auto">
          <ul role="menu" className="space-y-5">
            <li>
              <button onClick={() => setShowAddTaskModal(true)} className="flex items-center gap-2 hover:text-red-400 transition">
                <PiPlusCircleFill className="text-2xl text-red-400" />
                <span className="text-sm">Add Task</span>
              </button>
            </li>
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-red-400 transition">
                <GoCalendar className="text-lg" />
                <span className="text-sm">Today</span>
              </Link>
            </li>
            <li>
              <Link to="upcominglist" className="flex items-center gap-2 hover:text-red-400 transition">
                <PiCalendarDotsThin className="text-lg" />
                <span className="text-sm">Upcoming</span>
              </Link>
            </li>
            <li>
              <Link to="completed" className="flex items-center gap-2 hover:text-red-400 transition">
                <PiCheckCircleThin className="text-lg" />
                <span className="text-sm">Completed</span>
              </Link>
            </li>
          </ul>
        </section>

        {/* ✅ Projects Section */}
        <section aria-labelledby="projects-title" className="mt-6">
          <header className="flex items-center justify-between mb-2">
            <h2 id="projects-title" className="font-semibold text-sm">
              My Projects
            </h2>
            <div className="flex items-center gap-2">
              <button onClick={handleAddProject} aria-label="Add Project">
                <PiPlus className="text-sm hover:text-red-400 transition" />
              </button>
              <button onClick={() => setShowProjects((prev) => !prev)} aria-label="Toggle Projects">
                <SlArrowDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${showProjects ? "rotate-0" : "-rotate-90"}`} />
              </button>
            </div>
          </header>

          {/* ✅ Project List */}
          {showProjects && (
            <ul className="pl-2 space-y-3 text-sm text-gray-700">
              {projects.map((project, i) => (
                <li key={i} className="flex items-center gap-2 cursor-pointer hover:text-red-400 transition duration-200">
                  <CiHashtag className="text-gray-500" />
                  {project}
                </li>
              ))}
            </ul>
          )}
        </section>
      </nav>

      {showAddTaskModal && <AddTaskModal onClose={() => setShowAddTaskModal(false)} />}
    </>
  );
}
