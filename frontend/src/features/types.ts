export type Project = {
  id: number;
  name: string;
};

export type Task = {
  id: string; // Initially it's a string
  title: string;
  description: string;
  status: string;
  priority: string;
  isCompleted: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  dueDate: string;
  reminderAt: string;
  projectId: number;
  project: { name: string } | null;
};

export type TasksByMonth = Record<string, Task[]>;
