import { useState } from "react";

interface AddProjectModalProps {
  onClose: () => void;
  onProjectCreated?: () => void;
}

export default function AddProjectModal({ onClose, onProjectCreated }: AddProjectModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddProject = async () => {
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://localhost:5021/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to create project.");
      }

      onProjectCreated?.();
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
      <div className="bg-white w-[400px] p-5 rounded-lg shadow-lg pointer-events-auto">
        <h2 className="text-lg font-semibold mb-3">New Project</h2>

        <input type="text" placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1 mb-2 focus:outline-none" />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm">
            Cancel
          </button>
          <button onClick={handleAddProject} disabled={loading} className={`px-3 py-1 rounded text-sm text-white bg-red-400 hover:bg-red-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Adding..." : "Add Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
