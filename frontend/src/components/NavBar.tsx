import { PiListLight } from "react-icons/pi";

export default function NavBar() {
  return (
    <nav className="h-full flex justify-end items-center">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-300 cursor-pointer"
        aria-label="View List"
      >
        <PiListLight className="text-lg" />
        <span className="text-sm">List</span>
      </button>
    </nav>
  );
}
