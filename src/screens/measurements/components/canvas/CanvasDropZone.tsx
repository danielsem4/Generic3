import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCanvasActions } from "../../hooks/canvas/useCanvasActions";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";
import { CanvasEmptyState } from "./CanvasEmptyState";

export function CanvasDropZone() {
  const { components, selectedComponentId, handleSelect, handleRemove } =
    useCanvasActions();

  const { setNodeRef, isOver } = useDroppable({ id: "canvas-drop-zone" });

  const ids = components.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] rounded-xl border-2 border-dashed p-4 transition-colors ${
        isOver ? "border-primary/50 bg-primary/5" : "border-border"
      }`}
    >
      {components.length === 0 ? (
        <CanvasEmptyState />
      ) : (
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {components.map((component) => (
              <CanvasComponentRenderer
                key={component.id}
                component={component}
                isSelected={component.id === selectedComponentId}
                onSelect={handleSelect}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
