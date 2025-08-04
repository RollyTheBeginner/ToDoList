interface AddTaskModalProps {
  onClose: () => void;
}

export default function AddTaskModal({ onClose }: AddTaskModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Modal box */}
      <div className="bg-white w-[500px] p-5 rounded-lg shadow-lg pointer-events-auto">
        {/* Fields */}
        <div className="space-y-3">
          <input type="text" placeholder="Title" className="w-full rounded placeholder:text-2xl focus:outline-none focus:ring-0 focus:border-none" />

          <textarea placeholder="Description" className="w-full rounded placeholder:text-sm resize-none focus:outline-none focus:ring-0 focus:border-none h-auto" />

          <div className="flex gap-2">
            <input type="date" className="border border-gray-200 rounded text-sm px-2 py-1" />
            <select className="border border-gray-200 rounded text-sm px-2 py-1">
              <option>Priority 1</option>
              <option>Priority 2</option>
              <option>Priority 3</option>
              <option>Priority 4</option>
            </select>

            <button className="border border-gray-200 rounded text-sm px-2 py-1">Reminders</button>
            <button className="border border-gray-200 rounded text-sm px-2 py-1">. . .</button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-4 gap-2">
          {/* Left: Project Button Auto-Fit */}
          <button className="border border-gray-200 px-2 py-1 rounded text-sm w-auto"># My Project</button>

          {/* Right: Cancel & Add Task */}
          <div className="flex gap-2">
            <button onClick={onClose} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm w-auto">
              Cancel
            </button>
            <button className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 text-sm w-auto">Add Task</button>
          </div>
        </div>
      </div>
    </div>
  );
}
