import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";

export function useCanvasActions() {
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useMeasurementBuilderStore(
    (s) => s.selectedComponentId,
  );
  const selectComponent = useMeasurementBuilderStore(
    (s) => s.selectComponent,
  );
  const removeComponent = useMeasurementBuilderStore(
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
