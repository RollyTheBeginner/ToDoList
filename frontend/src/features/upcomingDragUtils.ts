import type { DropResult } from "@hello-pangea/dnd";
import type { Task } from "./types";

export const handleDragEnd = (result: DropResult, month: string, tasksByMonth: Record<string, Task[]>, setTasksByMonth: (value: Record<string, Task[]>) => void) => {
  if (!result.destination) return;

  const items = Array.from(tasksByMonth[month]);
  const [reordered] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, reordered);

  setTasksByMonth({ ...tasksByMonth, [month]: items });
};
