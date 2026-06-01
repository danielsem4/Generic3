import { useEvaluationBuilderStore } from "@/store/useEvaluationBuilderStore";

export function useScreenManager() {
  const screens = useEvaluationBuilderStore((s) => s.screens);
  const activeScreenIndex = useEvaluationBuilderStore(
    (s) => s.activeScreenIndex,
  );
  const addScreen = useEvaluationBuilderStore((s) => s.addScreen);
  const removeScreen = useEvaluationBuilderStore((s) => s.removeScreen);
  const setActiveScreen = useEvaluationBuilderStore(
    (s) => s.setActiveScreen,
  );
  const renameScreen = useEvaluationBuilderStore((s) => s.renameScreen);
  const reorderScreens = useEvaluationBuilderStore((s) => s.reorderScreens);

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
