import { CanvasDropZone } from "../canvas/CanvasDropZone";
import { ScreenTabBar } from "../screen-tabs/ScreenTabBar";
import { VersionContext } from "../version-selector/VersionContext";
import { useScreenManager } from "../../hooks/screens/useScreenManager";
import { useScreenScore } from "../../hooks/screens/useScreenScore";
import { useVersionSelector } from "../../hooks/builder/useVersionSelector";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";

export function BuilderCenterPanel() {
  const {
    screens,
    activeScreenIndex,
    canDeleteScreen,
    handleAddScreen,
    handleRemoveScreen,
    handleGoToScreen,
    handleRenameScreen,
    handleReorderScreens,
  } = useScreenManager();

  const totalScore = useScreenScore();

  const {
    panelVersionKey,
    getVariantForComponent,
    getV1ElementForComponent,
    getVariantCountForComponent,
  } = useVersionSelector();

  const globalPreviewVersion = useMeasurementBuilderStore((s) => s.globalPreviewVersion);

  return (
    <VersionContext.Provider
      value={{
        panelVersionKey,
        globalPreviewVersion,
        getVariantForComponent,
        getV1ElementForComponent,
        getVariantCountForComponent,
      }}
    >
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <ScreenTabBar
          screens={screens}
          activeScreenIndex={activeScreenIndex}
          onSelectScreen={handleGoToScreen}
          onAddScreen={handleAddScreen}
          onRemoveScreen={handleRemoveScreen}
          onRenameScreen={handleRenameScreen}
          onReorderScreens={handleReorderScreens}
          canDeleteScreen={canDeleteScreen}
          totalScore={totalScore}
        />
        <div className="flex-1 overflow-y-auto bg-muted/30 p-6">
          <div className="mx-auto max-w-2xl">
            <CanvasDropZone />
          </div>
        </div>
      </div>
    </VersionContext.Provider>
  );
}
