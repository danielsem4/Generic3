import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";

export function useScreenManager() {
  const screens = useMeasurementBuilderStore((s) => s.screens);
  const activeScreenIndex = useMeasurementBuilderStore(
    (s) => s.activeScreenIndex,
  );
  const addScreen = useMeasurementBuilderStore((s) => s.addScreen);
  const removeScreen = useMeasurementBuilderStore((s) => s.removeScreen);
  const setActiveScreen = useMeasurementBuilderStore(
    (s) => s.setActiveScreen,
  );
  const renameScreen = useMeasurementBuilderStore((s) => s.renameScreen);
  const reorderScreens = useMeasurementBuilderStore((s) => s.reorderScreens);

  const totalScreens = screens.length;
  const canDeleteScreen = screens.length > 1;
  const canGoNext = activeScreenIndex < screens.length - 1;
  const canGoPrev = activeScreenIndex > 0;

  function handleAddScreen() {
    addScreen();
  }

  function handleRemoveScreen(index: number) {
    removeScreen(index);
  }

  function handleGoToScreen(index: number) {
    setActiveScreen(index);
  }

  function handleGoNext() {
    if (canGoNext) setActiveScreen(activeScreenIndex + 1);
  }

  function handleGoPrev() {
    if (canGoPrev) setActiveScreen(activeScreenIndex - 1);
  }

  function handleRenameScreen(index: number, title: string) {
    renameScreen(index, title);
  }

  function handleReorderScreens(fromIndex: number, toIndex: number) {
    reorderScreens(fromIndex, toIndex);
  }

  return {
    screens,
    activeScreenIndex,
    totalScreens,
    canDeleteScreen,
    canGoNext,
    canGoPrev,
    handleAddScreen,
    handleRemoveScreen,
    handleGoToScreen,
    handleGoNext,
    handleGoPrev,
    handleRenameScreen,
    handleReorderScreens,
  };
}
