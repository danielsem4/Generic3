import {
  useQuestionnaireBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useQuestionnaireBuilderStore";
import { findComponentById } from "../lib/treeUtils";
import { componentRegistry } from "../lib/componentRegistry";
import type { IQComponent } from "@/common/types/questionnaire";

export function usePropertyEditor() {
  const components = useQuestionnaireBuilderStore(selectActiveScreenComponents);
  const selectedComponentId = useQuestionnaireBuilderStore(
    (s) => s.selectedComponentId,
  );
  const updateComponentProps = useQuestionnaireBuilderStore(
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
