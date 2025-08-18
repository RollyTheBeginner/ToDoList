export const markTaskComplete = async (taskId: string, refreshTasks?: () => void): Promise<void> => {
  try {
    await fetch(`https://localhost:5021/api/tasks/${taskId}/complete`, {
      method: "PATCH",
    });

    if (refreshTasks) refreshTasks();
  } catch (err) {
    console.error("Failed to mark task completed:", err);
  }
};

export const editTask = async (updatedTask: { id: string; title: string; description: string; dueDate: string; priority: number; projectId?: number }, refresh?: () => void): Promise<void> => {
  const confirmed = confirm("Are you sure you want to update this task?");
  if (!confirmed) return;

  try {
    const response = await fetch(`https://localhost:5021/api/tasks/${updatedTask.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to update task.");
    }

    if (refresh) refresh();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred while updating task.";
    alert(message);
    console.error("Update task error:", err);
  }
};

export const deleteTask = async (taskId: string, refresh?: () => void): Promise<void> => {
  const confirmed = confirm("Are you sure you want to delete this task?");
  if (!confirmed) return;

  try {
    const response = await fetch(`https://localhost:5021/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "Failed to delete task.");
    }

    if (refresh) refresh();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred while deleting task.";
    alert(message);
    console.error("Delete task error:", err);
  }
};
