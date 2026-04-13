import { useState } from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { QComponentType } from "@/common/types/measurement";
import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import { createComponentFromType } from "../lib/componentRegistry";

interface ActiveDragItem {
  source: "toolbox" | "canvas";
  componentType?: QComponentType;
  componentId?: string;
}

export function useBuilderDnd() {
  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null);

  const addComponent = useMeasurementBuilderStore((s) => s.addComponent);
  const addComponentToRow = useMeasurementBuilderStore(
    (s) => s.addComponentToRow,
  );
  const moveComponent = useMeasurementBuilderStore((s) => s.moveComponent);
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as ActiveDragItem | undefined;
    if (data) {
      setActiveItem(data);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);

    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as ActiveDragItem | undefined;
    if (!activeData) return;

    const overId = over.id as string;
    const overData = over.data.current as
      | { type?: string; parentId?: string; index?: number }
      | undefined;

    if (activeData.source === "toolbox" && activeData.componentType) {
      // Prevent nesting rows inside rows
      if (
        activeData.componentType === "rowContainer" &&
        overData?.parentId
      ) {
        return;
      }

      const newComponent = createComponentFromType(activeData.componentType);

      if (overData?.parentId) {
        const idx = overData.index ?? 0;
        addComponentToRow(newComponent, overData.parentId, idx);
      } else {
        const dropIndex = getDropIndex(overId);
        addComponent(newComponent, dropIndex);
      }
    } else if (activeData.source === "canvas" && activeData.componentId) {
      // Prevent moving rows into rows
      const sourceComp = components.find(
        (c) => c.id === activeData.componentId,
      );
      if (sourceComp?.type === "rowContainer" && overData?.parentId) {
        return;
      }

      const toIndex = getDropIndex(overId);
      moveComponent(activeData.componentId, toIndex, overData?.parentId);
    }
  }

  function getDropIndex(overId: string): number {
    if (overId === "canvas-drop-zone") {
      return components.length;
    }
    const idx = components.findIndex((c) => c.id === overId);
    return idx >= 0 ? idx : components.length;
  }

  return {
    sensors,
    activeItem,
    handleDragStart,
    handleDragEnd,
  };
}
