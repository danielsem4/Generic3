import { CanvasDropZone } from "./CanvasDropZone";
import { ScreenTabBar } from "./ScreenTabBar";
import { useScreenManager } from "../hooks/useScreenManager";
import { useScreenScore } from "../hooks/useScreenScore";

export function BuilderCenterPanel() {
  const {
    screens,
    activeScreenIndex,
    canDeleteScreen,
    handleAddScreen,
    handleRemoveScreen,
    handleGoToScreen,
    handleRenameScreen,
  } = useScreenManager();

  const totalScore = useScreenScore();

  return (
    <div className="flex flex-1 flex-col overflow-hidden min-w-0">
      <ScreenTabBar
        screens={screens}
        activeScreenIndex={activeScreenIndex}
        onSelectScreen={handleGoToScreen}
        onAddScreen={handleAddScreen}
        onRemoveScreen={handleRemoveScreen}
        onRenameScreen={handleRenameScreen}
        canDeleteScreen={canDeleteScreen}
        totalScore={totalScore}
      />
      <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
        <div className="mx-auto max-w-2xl">
          <CanvasDropZone />
        </div>
      </div>
    </div>
  );
}
