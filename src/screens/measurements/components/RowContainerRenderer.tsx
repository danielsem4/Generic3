import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { X, GripVertical, Columns } from "lucide-react";
import type { IQComponent, IQRowContainer } from "@/common/types/measurement";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";

interface SortableProps {
  ref: (node: HTMLElement | null) => void;
  style: React.CSSProperties;
  attributes: Record<string, unknown>;
  listeners: Record<string, unknown> | undefined;
}

interface RowContainerRendererProps {
  component: IQRowContainer;
  isSelected: boolean;
  isPreview?: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  sortableProps: SortableProps;
}

export function RowContainerRenderer({
  component,
  isSelected,
  isPreview,
  onSelect,
  onRemove,
  sortableProps,
}: RowContainerRendererProps) {
  const { ref, style, attributes, listeners } = sortableProps;

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `row-drop-${component.id}`,
    data: { parentId: component.id, type: "row" },
  });

  const childIds = component.children.map((c: IQComponent) => c.id);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (!isPreview) onSelect(component.id);
  }

  function handleRemoveClick(e: React.MouseEvent) {
    e.stopPropagation();
    onRemove(component.id);
  }

  return (
    <div
      ref={ref}
      style={style}
      onClick={handleClick}
      className={`group relative rounded-lg border-2 border-dashed bg-card p-3 transition-all ${
        isSelected && !isPreview
          ? "ring-2 ring-primary border-primary"
          : "border-border hover:border-muted-foreground/30"
      } ${isPreview ? "border-transparent" : "cursor-pointer"}`}
    >
      {!isPreview && (
        <div className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
          <div
            {...listeners}
            {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
            className="cursor-grab"
          >
            <GripVertical size={14} />
          </div>
          <Columns size={12} />
          <span className="font-medium">{component.label}</span>
        </div>
      )}

      {!isPreview && (
        <button
          type="button"
          onClick={handleRemoveClick}
          className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs group-hover:flex"
        >
          <X size={12} />
        </button>
      )}

      <div
        ref={setDropRef}
        className={`flex gap-2 min-h-[48px] rounded-md p-1 transition-colors ${
          isOver ? "bg-primary/10" : ""
        } ${component.children.length === 0 ? "items-center justify-center border border-dashed border-muted-foreground/20" : ""}`}
      >
        {component.children.length === 0 ? (
          <span className="text-xs text-muted-foreground">
            Drop components here
          </span>
        ) : (
          <SortableContext
            items={childIds}
            strategy={horizontalListSortingStrategy}
          >
            {component.children.map((child: IQComponent) => (
              <div key={child.id} className="flex-1">
                <CanvasComponentRenderer
                  component={child}
                  isSelected={false}
                  isPreview={isPreview}
                  onSelect={onSelect}
                  onRemove={onRemove}
                  parentId={component.id}
                />
              </div>
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}
