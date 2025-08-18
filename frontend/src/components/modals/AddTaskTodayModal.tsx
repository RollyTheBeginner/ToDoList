import { useState, useEffect, useRef } from "react";

export type Project = {
  id: number;
  name: string;
};

interface AddTaskTodayModalProps {
  projects: Project[];
  onClose: () => void;
  onTaskCreated: () => void;
}

export default function AddTaskTodayModal({ projects, onClose, onTaskCreated }: AddTaskTodayModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleAddTask = async () => {
    if (!title.trim()) return setError("Title is required");
    if (!selectedProjectName.trim()) return setError("Project is required");
    if (priority === "") return setError("Priority is required");

    setLoading(true);
    setError("");

    try {
      const payload = {
        title,
        description,
        status: 0,
        priority: Number(priority),
        isCompleted: false,
        dueDate: new Date().toISOString().split("T")[0],
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

      const match = projects.find((p) => p.name.toLowerCase() === selectedProjectName.trim().toLowerCase());

      if (match) {
        payload.projectId = match.id;
      } else {
        payload.newProject = { name: selectedProjectName.trim() };
      }

      const response = await fetch("https://localhost:5021/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to add task");

      onTaskCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-md w-full">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} ref={titleInputRef} className="w-full rounded px-2 py-1 text-sm border border-gray-50" />

      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded px-2 py-1 text-sm border border-gray-50 mt-2" />

      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded px-2 py-1 text-sm border border-gray-50 mt-2">
        <option value="">Priority</option>
        <option value="0">Low</option>
        <option value="1">Medium</option>
        <option value="2">High</option>
        <option value="3">Critical</option>
      </select>

      <div className="flex justify-between items-start mt-4 gap-2">
        <div className="flex flex-col gap-1">
          <input
            list="projects-list"
            placeholder="# Project"
            value={selectedProjectName}
            onChange={(e) => setSelectedProjectName(e.target.value)}
            className="rounded px-2 py-1 text-sm border border-gray-50"
          />
          <datalist id="projects-list">
            {projects.map((p) => (
              <option key={p.id} value={p.name} />
            ))}
          </datalist>
        </div>

        <div className="flex gap-2 mt-2">
          <button onClick={onClose} className="px-2 py-1 text-sm text-gray-500 hover:text-red-500">
            Cancel
          </button>
          <button onClick={handleAddTask} disabled={loading} className={`px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Adding..." : "Add Task"}
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
