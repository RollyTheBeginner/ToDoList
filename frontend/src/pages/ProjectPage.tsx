import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  isCompleted: boolean;
  dueDate: string;
  reminderAt?: string;
}
// Map priority numbers to labels and colors
const priorityMap: Record<number, { label: string; color: string }> = {
  0: { label: "Low", color: "text-green-500" },
  1: { label: "Medium", color: "text-blue-500" },
  2: { label: "High", color: "text-orange-500" },
  3: { label: "Critical", color: "text-red-500" },
};

const statusMap: Record<number, string> = {
  0: "Pending",
  1: "In Progress",
  2: "Completed",
  3: "On Hold",
};

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    fetch(`https://localhost:5021/api/tasks/project/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return <p>Loading tasks...</p>;
  if (!tasks.length) return <p>No tasks for this project.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => {
        const priority = priorityMap[task.priority as unknown as number];
        const status = statusMap[task.status as unknown as number];

        return (
          <div key={task.id} className="p-4 border rounded shadow hover:shadow-md transition">
            <h3 className="font-semibold">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()} | Status: {status}
            </p>
            <p className={`text-xs mt-1 font-semibold ${priority.color}`}>Priority: {priority.label}</p>
          </div>
        );
      })}
    </div>
  );
}
