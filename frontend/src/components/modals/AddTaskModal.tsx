import { useState } from "react";

interface AddTaskModalProps {
  onClose: () => void;
  projects: { id: number; name: string }[];
  onTaskCreated?: () => void;
}

export default function AddTaskModal({ onClose, projects = [], onTaskCreated }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<string | number>("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddTask = async () => {
    if (!title.trim()) return setError("Title is required.");
    if (!dueDate) return setError("Due date is required.");
    if (!selectedProjectName.trim()) return setError("Please select or type a project name.");
    if (priority === "" || priority === null) return setError("Please select a priority.");

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        description,
        status: 0,
        priority: typeof priority === "number" ? priority : 0,
        isCompleted: false,
        dueDate,
        reminderAt: new Date().toISOString(),
      } as {
        title: string;
        description: string;
        status: number;
        priority: number;
        isCompleted: boolean;
        dueDate: string;
        reminderAt: string;
        projectId?: number;
        newProject?: { name: string };
      };

      const existingProject = projects.find((p) => p.name === selectedProjectName.trim());

      if (existingProject) {
        payload.projectId = existingProject.id;
      } else {
        payload.newProject = { name: selectedProjectName.trim() };
      }

      const response = await fetch("https://localhost:5021/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to create task.");
      }

      onTaskCreated?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white w-[500px] p-5 rounded-lg shadow-lg pointer-events-auto">
        <div className="space-y-3">
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded placeholder:text-2xl focus:outline-none" />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded placeholder:text-sm resize-none focus:outline-none h-auto"
          />

          <div className="flex gap-2">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border border-gray-200 rounded text-sm px-2 py-1" />

            <select value={priority} onChange={(e) => setPriority(Number(e.target.value))} className="border border-gray-200 rounded text-sm px-2 py-1">
              <option value="" disabled>
                Priority
              </option>
              <option value={0}>Low</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
              <option value={3}>Critical</option>
            </select>
          </div>

          <div className="flex justify-between mt-4 gap-2">
            <div className="flex flex-col gap-1">
              <input
                list="projects-list"
                placeholder="# My Project"
                value={selectedProjectName}
                onChange={(e) => setSelectedProjectName(e.target.value)}
                className="border border-gray-200 rounded text-sm px-2 py-1"
              />
              <datalist id="projects-list">
                {projects.map((project) => (
                  <option key={project.id} value={project.name} />
                ))}
              </datalist>
            </div>

            <div className="flex gap-2">
              <button onClick={onClose} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
                Cancel
              </button>
              <button onClick={handleAddTask} disabled={loading} className={`px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {loading ? "Adding..." : "Add Task"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
