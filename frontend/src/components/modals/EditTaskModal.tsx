import { useState, useEffect } from "react";
import type { Task } from "../../features/types";

interface EditTaskModalProps {
  onClose: () => void;
  projects: { id: number; name: string }[];
  taskToEdit: {
    id: number;
    title: string;
    description: string;
    dueDate: string;
    priority: number;
    projectId?: number;
  } | null;
  onTaskUpdated?: (updatedTask: Task) => void; // ✅ updated
}

export default function EditTaskModal({ onClose, projects = [], taskToEdit, onTaskUpdated }: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<number | string>("");
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setSelectedProjectName(taskToEdit.projectId ? projects.find((p) => p.id === taskToEdit.projectId)?.name || "" : "");
    }
  }, [taskToEdit, projects]);

  const handleEditTask = async () => {
    if (!title.trim()) return setError("Title is required.");
    if (!dueDate) return setError("Due date is required.");
    if (!selectedProjectName.trim()) return setError("Please select or type a project name.");
    if (priority === "" || priority === null) return setError("Please select a priority.");

    setLoading(true);
    setError("");

    try {
      const taskId = taskToEdit?.id ? Number(taskToEdit.id) : 0; // Ensure id is a number

      // Define the payload with explicit types
      const payload: {
        id: number;
        title: string;
        description: string;
        status: number;
        priority: number;
        isCompleted: boolean;
        dueDate: string;
        reminderAt: string;
        projectId?: number;
        newProject?: { name: string };
      } = {
        id: taskId,
        title,
        description,
        status: 0, // Assuming the task is not completed yet
        priority: typeof priority === "number" ? priority : 0, // Ensure priority is a number
        isCompleted: false,
        dueDate,
        reminderAt: new Date().toISOString(),
      };

      // Check if a project already exists or create a new one
      const existingProject = projects.find((p) => p.name === selectedProjectName.trim());

      if (existingProject) {
        payload.projectId = existingProject.id; // If project exists, assign projectId
      } else {
        payload.newProject = { name: selectedProjectName.trim() }; // Create a new project if it doesn't exist
      }

      // Perform the update request to the API
      const response = await fetch(`https://localhost:5021/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update task.");
      }

      // Construct the updated task object to pass back to the parent
      const updatedTask: Task = {
        id: String(taskId), // Convert id to string as per your model
        title,
        description,
        status: "0", // Assuming a string representation of status
        priority: String(priority), // Convert priority to string
        isCompleted: false,
        isTrashed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        dueDate,
        reminderAt: new Date().toISOString(),
        projectId: existingProject?.id ?? 0, // Use the project ID, fallback to 0 if none
        project: existingProject ? { name: existingProject.name } : null, // Pass the project details
      };

      // Update the task in the parent component state
      onTaskUpdated?.(updatedTask);

      // Close the modal after the update
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
              <button onClick={handleEditTask} disabled={loading} className={`px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500 text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
