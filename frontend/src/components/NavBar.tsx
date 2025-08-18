import { PiSidebarSimpleThin } from "react-icons/pi";

type NavBarProps = {
  onToggle: () => void;
  isSidebarOpen: boolean;
};

export default function NavBar({ onToggle, isSidebarOpen }: NavBarProps) {
  return (
    <header className="h-full flex justify-between items-center px-2" role="banner">
      <div className="w-8 flex justify-center">
        {!isSidebarOpen && (
          <button type="button" aria-label="Open Sidebar" onClick={onToggle} className="p-1">
            <PiSidebarSimpleThin className="text-xl cursor-pointer hover:text-red-400" />
          </button>
        )}
      </div>
    </header>
  );
}
