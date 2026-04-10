import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useMeasurementBuilder } from "./hooks/useMeasurementBuilder";
import { useBuilderDnd } from "./hooks/useBuilderDnd";
import { usePreviewMode } from "./hooks/usePreviewMode";
import { BuilderTopBar } from "./components/BuilderTopBar";
import { BuilderLeftPanel } from "./components/BuilderLeftPanel";
import { BuilderCenterPanel } from "./components/BuilderCenterPanel";
import { BuilderRightPanel } from "./components/BuilderRightPanel";
import { PreviewOverlay } from "./components/PreviewOverlay";
import { ToolboxItem } from "./components/ToolboxItem";
import { componentRegistry } from "./lib/componentRegistry";

export default function MeasurementBuilder() {
  const {
    activeMeasurement,
    isPreviewMode,
    isDirty,
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  } = useMeasurementBuilder();

  const { sensors, activeItem, handleDragStart, handleDragEnd } =
    useBuilderDnd();

  const {
    previewDevice,
    deviceWidth,
    deviceHeight,
    screens,
    togglePreview,
    setDevice,
  } = usePreviewMode();

  if (isPreviewMode) {
    return (
      <PreviewOverlay
        screens={screens}
        device={previewDevice}
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight}
        onDeviceChange={setDevice}
        onExit={togglePreview}
      />
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <BuilderTopBar
        measurementName={activeMeasurement?.name}
        isDirty={isDirty}
        onSave={handleSave}
        onBack={handleBack}
        onClear={handleClearCanvas}
        onPreview={handleTogglePreview}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          <BuilderLeftPanel />
          <BuilderCenterPanel />
          <BuilderRightPanel />
        </div>

        <DragOverlay>
          {activeItem?.source === "toolbox" && activeItem.componentType ? (
            <div className="opacity-80">
              <ToolboxItem
                type={activeItem.componentType}
                label={activeItem.componentType}
                icon={componentRegistry[activeItem.componentType].icon}
                isOverlay
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
