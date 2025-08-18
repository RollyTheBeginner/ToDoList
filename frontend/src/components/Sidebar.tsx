import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { PiCalendarDotsThin, PiCheckCircleThin, PiClockAfternoon, PiDotsThreeVertical, PiPlus, PiPlusCircleFill, PiSidebarSimpleThin } from "react-icons/pi";
import { SlArrowDown } from "react-icons/sl";
import { CiHashtag } from "react-icons/ci";
import { GoCalendar } from "react-icons/go";
import AddTaskModal from "./modals/AddTaskModal";
import AddProjectModal from "./modals/AddProjectModal";
import myImage from "../assets/images/123.jpg";

type SidebarProps = {
  onToggle: () => void;
};

export default function Sidebar({ onToggle }: SidebarProps) {
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showProjects, setShowProjects] = useState(true);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const fetchProjects = () => {
    fetch("https://localhost:5021/api/projects")
      .then((res) => res.json())
      .then(setProjects)
      .catch((err) => console.error("Failed to fetch projects:", err));
  };

  useEffect(() => {
    fetchProjects();

    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".project-menu")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleDeleteProject = (id: number) => {
    if (!confirm("Are you sure you want to delete this project and all its tasks?")) return;

    fetch(`https://localhost:5021/api/projects/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(fetchProjects)
      .finally(() => setActiveMenu(null));
  };

  return (
    <>
      <nav className="w-full h-full flex flex-col" aria-label="Sidebar Navigation">
        {/* User Header */}
        <header className="flex justify-between items-center mb-6">
          <button aria-label="User Menu" className="flex items-center gap-2 pr-1 rounded-b-sm hover:text-red-400 hover:bg-gray-100 transition">
            <img src={myImage} alt="User avatar" className="w-7 h-7 rounded-full object-cover" />
            <span className="text-sm">Rolly</span>
            <SlArrowDown className="w-3 h-3 text-gray-600" />
          </button>

          <button aria-label="Toggle Sidebar" onClick={onToggle}>
            <PiSidebarSimpleThin className="text-xl hover:text-red-400 transition" />
          </button>
        </header>

        {/* Main Navigation */}
        <section aria-label="Main Navigation" className="overflow-y-auto">
          <ul role="menu" className="space-y-5">
            <li>
              <button onClick={() => setShowAddTaskModal(true)} className="flex items-center gap-2 hover:text-red-400 transition">
                <PiPlusCircleFill className="text-2xl text-red-400" />
                <span className="text-sm">Add Task</span>
              </button>
            </li>

            {[
              { to: "/", label: "Today", icon: <GoCalendar /> },
              { to: "/upcominglist", label: "Upcoming", icon: <PiCalendarDotsThin /> },
              { to: "/overdue", label: "Overdue", icon: <PiClockAfternoon /> },
              { to: "/completed", label: "Completed", icon: <PiCheckCircleThin /> },
            ].map(({ to, label, icon }) => (
              <li key={label}>
                <NavLink to={to} className={({ isActive }) => `flex items-center gap-2 transition ${isActive ? "text-red-500" : "hover:text-red-400"}`}>
                  <span className="text-lg">{icon}</span>
                  <span className="text-sm">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </section>

        {/* Projects Section */}
        <section aria-labelledby="projects-title" className="mt-6">
          <header className="flex items-center justify-between mb-2">
            <h2 id="projects-title" className="font-semibold text-sm">
              My Projects
            </h2>
            <div className="flex items-center gap-2">
              <button aria-label="Add Project" onClick={() => setShowAddProjectModal(true)}>
                <PiPlus className="text-sm hover:text-red-400 transition" />
              </button>
              <button onClick={() => setShowProjects((prev) => !prev)} aria-label="Toggle Projects">
                <SlArrowDown className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${showProjects ? "rotate-0" : "-rotate-90"}`} />
              </button>
            </div>
          </header>

          {showProjects && (
            <ul className="pl-2 space-y-3 text-sm">
              {projects.map(({ id, name }) => (
                <li key={id} className="flex items-center justify-between">
                  <NavLink
                    to={`/tasks/project/${id}`}
                    className={({ isActive }) => `flex items-center gap-2 w-full cursor-pointer transition duration-200 ${isActive ? "text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <CiHashtag />
                    {name}
                  </NavLink>

                  <div className="relative project-menu">
                    <button onClick={() => setActiveMenu(id)} className="p-1 hover:bg-gray-100 rounded">
                      <PiDotsThreeVertical />
                    </button>

                    {activeMenu === id && (
                      <div className="absolute left-full top-0 ml-2 bg-white shadow-md rounded z-10 whitespace-nowrap">
                        <button onClick={() => handleDeleteProject(id)} className="block px-3 py-1 hover:bg-red-100 text-red-500 text-sm">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </nav>

      {/* Modals */}
      {showAddTaskModal && <AddTaskModal onClose={() => setShowAddTaskModal(false)} projects={projects} onTaskCreated={fetchProjects} />}

      {showAddProjectModal && <AddProjectModal onClose={() => setShowAddProjectModal(false)} onProjectCreated={fetchProjects} />}
    </>
  );
}
