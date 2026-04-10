import { useDraggable } from "@dnd-kit/core";
import type { QComponentType } from "@/common/types/measurement";

interface ToolboxItemProps {
  type: QComponentType;
  label: string;
  icon: React.ElementType;
  isOverlay?: boolean;
}

export function ToolboxItem({
  type,
  label,
  icon: Icon,
  isOverlay,
}: ToolboxItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${type}`,
    data: { source: "toolbox" as const, componentType: type },
  });

  if (isOverlay) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border bg-card p-2 text-center shadow-lg">
        <Icon size={20} className="text-primary" />
        <span className="text-[11px] leading-tight font-medium">{label}</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex cursor-grab flex-col items-center gap-1 rounded-lg border bg-background p-2 text-center transition-colors hover:border-primary/50 hover:bg-accent ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <Icon size={20} className="text-muted-foreground" />
      <span className="text-[11px] leading-tight font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
