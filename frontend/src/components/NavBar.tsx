import { PiListLight, PiSidebarSimpleThin } from "react-icons/pi";

export default function NavBar({ onToggle, isSidebarOpen }: { onToggle: () => void; isSidebarOpen: boolean }) {
  return (
    <header className="h-full flex justify-between items-center px-2" role="banner">
      {/* Fixed width container to prevent shifting */}
      <div className="w-8 flex justify-center">
        {!isSidebarOpen && (
          <button type="button" aria-label="Open Sidebar" onClick={onToggle} className="p-1">
            <PiSidebarSimpleThin className="text-xl cursor-pointer hover:text-red-400" />
          </button>
        )}
      </div>

      {/* Right Section: List View Button */}
      <nav aria-label="Navigation Actions">
        <ul className="flex">
          <li>
            <button
              type="button"
              aria-label="View List"
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <PiListLight className="text-lg" />
              <span className="text-sm">List</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
