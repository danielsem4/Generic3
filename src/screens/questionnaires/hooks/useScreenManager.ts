import { useQuestionnaireBuilderStore } from "@/store/useQuestionnaireBuilderStore";

export function useScreenManager() {
  const screens = useQuestionnaireBuilderStore((s) => s.screens);
  const activeScreenIndex = useQuestionnaireBuilderStore(
    (s) => s.activeScreenIndex,
  );
  const addScreen = useQuestionnaireBuilderStore((s) => s.addScreen);
  const removeScreen = useQuestionnaireBuilderStore((s) => s.removeScreen);
  const setActiveScreen = useQuestionnaireBuilderStore(
    (s) => s.setActiveScreen,
  );
  const renameScreen = useQuestionnaireBuilderStore((s) => s.renameScreen);

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
  };
}
