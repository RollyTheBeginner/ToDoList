import { GoCalendar, GoInbox, GoSearch } from "react-icons/go";
import {
  PiCalendarDotsThin,
  PiCheckCircleThin,
  PiNotificationThin,
  PiPlus,
  PiPlusCircleFill,
  PiSidebarSimpleThin,
} from "react-icons/pi";
import myImage from "../assets/images/123.jpg";
import { SlArrowDown } from "react-icons/sl";

export default function Sidebar() {
  return (
    <nav className="w-full">
      {/* Header / User Profile */}
      <header className="flex justify-between items-center mb-6">
        <button className="flex items-center gap-2 cursor-pointer hover:text-red-400 hover:bg-gray-100 transition-colors duration-300 pr-1 rounded-b-sm">
          <img
            src={myImage}
            alt="User avatar"
            className="w-7 h-7 rounded-full object-cover"
          />
          <span>Rolly</span>
          <SlArrowDown />
        </button>

        <div className="flex gap-4">
          <button aria-label="Notifications">
            <PiNotificationThin className="text-xl cursor-pointer hover:text-red-400" />
          </button>
          <button aria-label="Toggle Sidebar">
            <PiSidebarSimpleThin className="text-xl cursor-pointer hover:text-red-400" />
          </button>
        </div>
      </header>

      {/* Main Navigation */}
      <section aria-label="Main Navigation">
        <ul className="space-y-5">
          <li>
            <button className="flex items-center gap-2 hover:text-red-400">
              <PiPlusCircleFill className="text-2xl text-red-400" />
              <span>Add Task</span>
            </button>
          </li>
          <li>
            <button className="flex items-center gap-2 hover:text-red-400">
              <GoSearch className="text-lg" />
              <span>Search</span>
            </button>
          </li>
          <li>
            <button className="flex items-center gap-2 hover:text-red-400">
              <GoInbox className="text-lg" />
              <span>Inbox</span>
            </button>
          </li>
          <li>
            <button className="flex items-center gap-2 hover:text-red-400">
              <GoCalendar className="text-lg " />
              <span>Today</span>
            </button>
          </li>
          <li>
            <button className="flex items-center gap-2 hover:text-red-400">
              <PiCalendarDotsThin className="text-lg " />
              <span>Upcoming</span>
            </button>
          </li>
          <li>
            <button className="flex items-center gap-2 hover:text-red-400">
              <PiCheckCircleThin className="text-lg " />
              <span>Completed</span>
            </button>
          </li>
        </ul>
      </section>

      {/* Projects Section */}
      <section aria-labelledby="projects-title" className="mt-4">
        <header className="flex items-center justify-between">
          <h2 id="projects-title" className="font-semibold">
            My Projects
          </h2>
          <div className="flex items-center gap-2">
            <button aria-label="Add Project">
              <PiPlus />
            </button>
            <button aria-label="Expand Projects">
              <SlArrowDown />
            </button>
          </div>
        </header>
        {/* Future: Add a <ul> here when listing projects dynamically */}
      </section>
    </nav>
  );
}
