import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IQScreen } from "@/common/types/measurement";
import { cn } from "@/lib/utils";

interface ScreenTabBarProps {
  screens: IQScreen[];
  activeScreenIndex: number;
  onSelectScreen: (index: number) => void;
  onAddScreen: () => void;
  onRemoveScreen: (index: number) => void;
  onRenameScreen: (index: number, title: string) => void;
  canDeleteScreen: boolean;
}

export function ScreenTabBar({
  screens,
  activeScreenIndex,
  onSelectScreen,
  onAddScreen,
  onRemoveScreen,
  onRenameScreen,
  canDeleteScreen,
}: ScreenTabBarProps) {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null,
  );

  function handleStartRename(index: number) {
    setEditingIndex(index);
    setEditValue(screens[index].title);
  }

  function handleCommitRename() {
    if (editingIndex !== null && editValue.trim()) {
      onRenameScreen(editingIndex, editValue.trim());
    }
    setEditingIndex(null);
  }

  function handleRenameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleCommitRename();
    if (e.key === "Escape") setEditingIndex(null);
  }

  function handleDeleteClick(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    if (!canDeleteScreen) return;
    setConfirmDeleteIndex(index);
  }

  function handleConfirmDelete() {
    if (confirmDeleteIndex !== null) {
      onRemoveScreen(confirmDeleteIndex);
      setConfirmDeleteIndex(null);
    }
  }

  return (
    <div className="flex items-center gap-1 border-b bg-card px-2 py-1 overflow-x-auto shrink-0">
      {screens.map((screen, index) => (
        <div
          key={screen.id}
          className={cn(
            "group relative flex shrink-0 items-center gap-1 rounded-t-md border border-b-0 px-3 py-1.5 text-sm cursor-pointer transition-colors",
            index === activeScreenIndex
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 hover:bg-muted",
          )}
          onClick={() => onSelectScreen(index)}
          onDoubleClick={() => handleStartRename(index)}
        >
          {editingIndex === index ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleCommitRename}
              onKeyDown={handleRenameKeyDown}
              className="h-5 w-24 px-1 py-0 text-sm"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate max-w-[120px]">
              {screen.title} ({screen.components.length})
            </span>
          )}

          {canDeleteScreen && index !== activeScreenIndex && (
            <button
              onClick={(e) => handleDeleteClick(e, index)}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-destructive/20 p-0.5"
              title={t("measurements.builder.screens.deleteScreen")}
            >
              <X size={12} />
            </button>
          )}
        </div>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onAddScreen}
        className="h-7 w-7 p-0 shrink-0"
        title={t("measurements.builder.screens.addScreen")}
      >
        <Plus size={14} />
      </Button>

      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-lg p-4 shadow-lg max-w-sm mx-4">
            <p className="text-sm font-medium mb-3">
              {t("measurements.builder.screens.deleteConfirm")}
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteIndex(null)}
              >
                {t("measurements.cancel")}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
              >
                {t("measurements.builder.screens.deleteScreen")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
