import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import type { IQScreen } from "@/common/types/measurement";
import { cn } from "@/lib/utils";

interface SortableScreenTabProps {
  screen: IQScreen;
  index: number;
  isActive: boolean;
  isEditing: boolean;
  editValue: string;
  canDelete: boolean;
  onSelect: (index: number) => void;
  onStartRename: (index: number) => void;
  onEditValueChange: (value: string) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onDeleteClick: (e: React.MouseEvent, index: number) => void;
}

export function SortableScreenTab({
  screen,
  index,
  isActive,
  isEditing,
  editValue,
  canDelete,
  onSelect,
  onStartRename,
  onEditValueChange,
  onCommitRename,
  onCancelRename,
  onDeleteClick,
}: SortableScreenTabProps) {
  const { t } = useTranslation();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: screen.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") onCommitRename();
    if (e.key === "Escape") onCancelRename();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex shrink-0 items-center gap-1 rounded-t-md border border-b-0 px-3 py-1.5 text-sm cursor-pointer transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 hover:bg-muted",
      )}
      onClick={() => onSelect(index)}
      onDoubleClick={() => onStartRename(index)}
    >
      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => onEditValueChange(e.target.value)}
          onBlur={onCommitRename}
          onKeyDown={handleRenameKeyDown}
          className="h-5 w-24 px-1 py-0 text-sm"
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="truncate max-w-[120px]">
          {screen.title} ({screen.components.length})
        </span>
      )}

      {canDelete && !isActive && (
        <button
          onClick={(e) => onDeleteClick(e, index)}
          onPointerDown={(e) => e.stopPropagation()}
          className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-destructive/20 p-0.5"
          title={t("measurements.builder.screens.deleteScreen")}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
