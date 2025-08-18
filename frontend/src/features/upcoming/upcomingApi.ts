import type { Task } from "../types";

export const getUpcomingTasks = async (): Promise<Task[]> => {
  try {
    const res = await fetch("https://localhost:5021/api/tasks/upcoming");
    const data: Task[] = await res.json();
    return data.map(t => ({ ...t, id: t.id.toString(), IsCompleted: t.IsCompleted ?? false }));
  } catch (err) {
    console.error("Failed to fetch upcoming tasks", err);
    return [];
  }
};
