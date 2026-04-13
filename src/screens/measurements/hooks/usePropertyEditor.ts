import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import { findComponentById } from "../lib/treeUtils";
import { componentRegistry } from "../lib/componentRegistry";
import type { IQComponent } from "@/common/types/measurement";

export function usePropertyEditor() {
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useMeasurementBuilderStore(
    (s) => s.selectedComponentId,
  );
  const updateComponentProps = useMeasurementBuilderStore(
    (s) => s.updateComponentProps,
  );

  const found = selectedComponentId
    ? findComponentById(components, selectedComponentId)
    : undefined;

  const selectedComponent = found?.component ?? null;
  const propertyFields = selectedComponent
    ? componentRegistry[selectedComponent.type].propertyFields
    : [];

  function handlePropertyChange(key: string, value: unknown) {
    if (!selectedComponentId) return;
    updateComponentProps(selectedComponentId, {
      [key]: value,
    } as Partial<IQComponent>);
  }

  return {
    selectedComponent,
    propertyFields,
    handlePropertyChange,
  };
}
