import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import { findComponentById } from "../lib/treeUtils";
import { componentRegistry } from "../lib/componentRegistry";
import type { PropertyFieldConfig } from "../lib/componentRegistry";
import type { IQComponent } from "@/common/types/measurement";
import { DYNAMIC_ANSWER_KEYS } from "@/common/types/measurement";

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

  const allFields = selectedComponent
    ? componentRegistry[selectedComponent.type].propertyFields
    : [];

  const propertyFields = allFields
    .filter((field) => {
      if (!field.visibleWhen || !selectedComponent) return true;
      const currentValue =
        (selectedComponent as unknown as Record<string, unknown>)[field.visibleWhen.key] ??
        "NONE";
      return field.visibleWhen.values.includes(String(currentValue));
    })
    .map((field): PropertyFieldConfig => {
      if (
        field.key === "correctAnswer" &&
        selectedComponent &&
        (selectedComponent as unknown as Record<string, unknown>).correctAnswerType ===
          "DYNAMIC"
      ) {
        return {
          ...field,
          fieldType: "select",
          options: DYNAMIC_ANSWER_KEYS.map((k) => ({ label: k, value: k })),
        };
      }
      return field;
    });

  function handlePropertyChange(key: string, value: unknown) {
    if (!selectedComponentId) return;

    if (key === "correctAnswerType") {
      const prev = selectedComponent
        ? ((selectedComponent as unknown as Record<string, unknown>).correctAnswerType ??
          "NONE")
        : "NONE";

      if (value === "NONE") {
        updateComponentProps(selectedComponentId, {
          correctAnswerType: "NONE",
          correctAnswer: "",
          grade: 0,
        } as Partial<IQComponent>);
        return;
      }

      if (
        (prev === "STATIC" && value === "DYNAMIC") ||
        (prev === "DYNAMIC" && value === "STATIC")
      ) {
        updateComponentProps(selectedComponentId, {
          correctAnswerType: value,
          correctAnswer: "",
        } as Partial<IQComponent>);
        return;
      }
    }

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
