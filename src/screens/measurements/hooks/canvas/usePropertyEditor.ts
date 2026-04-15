import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import { findComponentById } from "../../lib/treeUtils";
import { componentRegistry } from "../../lib/componentRegistry";
import type { PropertyFieldConfig } from "../../lib/componentRegistry";
import type { IQComponent, IQOptionItem } from "@/common/types/measurement";
import { DYNAMIC_ANSWER_KEYS, isOptionBasedComponent } from "@/common/types/measurement";

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

  const isOptionBased = selectedComponent
    ? isOptionBasedComponent(selectedComponent.type)
    : false;

  const currentAnswerType =
    (selectedComponent as unknown as Record<string, unknown> | null)
      ?.correctAnswerType ?? "NONE";

  const propertyFields = allFields
    .filter((field) => {
      if (
        isOptionBased &&
        currentAnswerType === "STATIC" &&
        (field.key === "correctAnswer" || field.key === "grade")
      ) {
        return false;
      }
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
    if (!selectedComponentId || !selectedComponent) return;

    if (key === "correctAnswerType") {
      const prev = (selectedComponent as unknown as Record<string, unknown>).correctAnswerType ?? "NONE";

      if (value === "NONE") {
        const updates: Record<string, unknown> = {
          correctAnswerType: "NONE",
          correctAnswer: "",
          grade: 0,
        };
        if (isOptionBased) {
          const opts = (selectedComponent as unknown as Record<string, unknown>).options as IQOptionItem[] | undefined;
          if (opts) {
            updates.options = opts.map((o) => ({ label: o.label, value: o.value }));
          }
        }
        updateComponentProps(selectedComponentId, updates as Partial<IQComponent>);
        return;
      }

      if (
        (prev === "STATIC" && value === "DYNAMIC") ||
        (prev === "DYNAMIC" && value === "STATIC")
      ) {
        const updates: Record<string, unknown> = {
          correctAnswerType: value,
          correctAnswer: "",
        };
        if (isOptionBased && prev === "STATIC") {
          const opts = (selectedComponent as unknown as Record<string, unknown>).options as IQOptionItem[] | undefined;
          if (opts) {
            updates.options = opts.map((o) => ({ label: o.label, value: o.value }));
          }
        }
        updateComponentProps(selectedComponentId, updates as Partial<IQComponent>);
        return;
      }
    }

    if (key === "options" && isOptionBased && currentAnswerType === "STATIC") {
      const opts = value as IQOptionItem[];
      const correctValues = opts
        .filter((o) => o.isCorrect)
        .map((o) => o.value);
      const totalGrade = opts.reduce(
        (sum, o) => sum + (o.isCorrect ? (o.score ?? 0) : 0),
        0,
      );
      updateComponentProps(selectedComponentId, {
        options: opts,
        correctAnswer: correctValues.join(","),
        grade: totalGrade,
      } as Partial<IQComponent>);
      return;
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
