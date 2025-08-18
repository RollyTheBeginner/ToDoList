import type { Task, TasksByMonth } from "../types";

export const fetchUpcomingTasks = async (): Promise<TasksByMonth> => {
  const res = await fetch("https://localhost:5021/api/tasks/upcoming");
  const data: Task[] = await res.json();

  const grouped: TasksByMonth = {};
  data.forEach((task) => {
    const date = new Date(task.dueDate);
    const monthKey = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    if (!grouped[monthKey]) grouped[monthKey] = [];
    grouped[monthKey].push({ ...task, id: task.id.toString(), IsCompleted: task.IsCompleted ?? false });
  });

  return grouped;
};
