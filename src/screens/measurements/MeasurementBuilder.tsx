import { DndContext, DragOverlay } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import { useMeasurementBuilder } from "./hooks/builder/useMeasurementBuilder";
import { useBuilderDnd } from "./hooks/builder/useBuilderDnd";
import { usePreviewMode } from "./hooks/builder/usePreviewMode";
import { BuilderTopBar } from "./components/builder-shell/BuilderTopBar";
import { BuilderLeftPanel } from "./components/builder-shell/BuilderLeftPanel";
import { BuilderCenterPanel } from "./components/builder-shell/BuilderCenterPanel";
import { BuilderRightPanel } from "./components/builder-shell/BuilderRightPanel";
import { PreviewOverlay } from "./components/preview/PreviewOverlay";
import { ToolboxItem } from "./components/toolbox/ToolboxItem";
import { componentRegistry } from "./lib/componentRegistry";

export default function MeasurementBuilder() {
  const { t } = useTranslation();
  const {
    activeMeasurement,
    isPreviewMode,
    isDirty,
    isSaving,
    isLoadingStructure,
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

  if (isLoadingStructure) {
    return (
      <div className="flex h-screen flex-col bg-background">
        <BuilderTopBar
          measurementName={activeMeasurement?.name}
          isDirty={isDirty}
          isSaving={isSaving}
          onSave={handleSave}
          onBack={handleBack}
          onClear={handleClearCanvas}
          onPreview={handleTogglePreview}
        />
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <BuilderTopBar
        measurementName={activeMeasurement?.name}
        isDirty={isDirty}
        isSaving={isSaving}
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
