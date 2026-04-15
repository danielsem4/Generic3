import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import type { IQScreen } from "@/common/types/measurement";
import { SortableScreenTab } from "./SortableScreenTab";

interface ScreenTabBarProps {
  screens: IQScreen[];
  activeScreenIndex: number;
  onSelectScreen: (index: number) => void;
  onAddScreen: () => void;
  onRemoveScreen: (index: number) => void;
  onRenameScreen: (index: number, title: string) => void;
  onReorderScreens: (fromIndex: number, toIndex: number) => void;
  canDeleteScreen: boolean;
  totalScore?: number;
}

export function ScreenTabBar({
  screens,
  activeScreenIndex,
  onSelectScreen,
  onAddScreen,
  onRemoveScreen,
  onRenameScreen,
  onReorderScreens,
  canDeleteScreen,
  totalScore,
}: ScreenTabBarProps) {
  const { t } = useTranslation();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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

  function handleCancelRename() {
    setEditingIndex(null);
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = screens.findIndex((s) => s.id === active.id);
    const toIndex = screens.findIndex((s) => s.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    onReorderScreens(fromIndex, toIndex);
  }

  return (
    <div className="flex items-center gap-1 border-b bg-card px-2 py-1 overflow-x-auto shrink-0">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={screens.map((s) => s.id)}
          strategy={horizontalListSortingStrategy}
        >
          {screens.map((screen, index) => (
            <SortableScreenTab
              key={screen.id}
              screen={screen}
              index={index}
              isActive={index === activeScreenIndex}
              isEditing={editingIndex === index}
              editValue={editValue}
              canDelete={canDeleteScreen}
              onSelect={onSelectScreen}
              onStartRename={handleStartRename}
              onEditValueChange={setEditValue}
              onCommitRename={handleCommitRename}
              onCancelRename={handleCancelRename}
              onDeleteClick={handleDeleteClick}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        variant="ghost"
        size="sm"
        onClick={onAddScreen}
        className="h-7 w-7 p-0 shrink-0"
        title={t("measurements.builder.screens.addScreen")}
      >
        <Plus size={14} />
      </Button>

      {!!totalScore && totalScore > 0 && (
        <div className="ml-auto shrink-0 text-xs font-medium text-muted-foreground px-2">
          {t("measurements.builder.totalScore")}: {totalScore}
        </div>
      )}

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
