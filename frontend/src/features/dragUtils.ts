import type { DropResult } from "@hello-pangea/dnd";

export const handleDragEnd = <T>(
  result: DropResult,
  list: T[],
  setList: (updated: T[]) => void
) => {
  if (!result.destination) return;

  const updated = [...list];
  const [moved] = updated.splice(result.source.index, 1);
  updated.splice(result.destination.index, 0, moved);

  setList(updated);
};