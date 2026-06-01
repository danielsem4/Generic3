import {
  useEvaluationBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useEvaluationBuilderStore";

export function useCanvasActions() {
  const components = useEvaluationBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useEvaluationBuilderStore(
    (s) => s.selectedComponentId,
  );
  const selectComponent = useEvaluationBuilderStore(
    (s) => s.selectComponent,
  );
  const removeComponent = useEvaluationBuilderStore(
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
