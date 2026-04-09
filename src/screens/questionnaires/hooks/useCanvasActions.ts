import {
  useQuestionnaireBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useQuestionnaireBuilderStore";

export function useCanvasActions() {
  const components = useQuestionnaireBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useQuestionnaireBuilderStore(
    (s) => s.selectedComponentId,
  );
  const selectComponent = useQuestionnaireBuilderStore(
    (s) => s.selectComponent,
  );
  const removeComponent = useQuestionnaireBuilderStore(
    (s) => s.removeComponent,
  );

  function handleSelect(id: string) {
    selectComponent(id === selectedComponentId ? null : id);
  }

  function handleRemove(id: string) {
    removeComponent(id);
  }

  return {
    components,
    selectedComponentId,
    handleSelect,
    handleRemove,
  };
}
