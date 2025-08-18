import type { Project, Task } from "../types";

export const getTodayTasks = async (): Promise<Task[]> => {
  try {
    const res = await fetch("https://localhost:5021/api/tasks/today");
    const data = await res.json();
    return (data as Task[]).map((t) => ({ ...t, id: t.id.toString() }));
  } catch (err) {
    console.error("Failed to fetch today tasks", err);
    return [];
  }
};

// Fetch all projects
export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch("https://localhost:5021/api/projects");
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch projects", err);
    return [];
  }
};
