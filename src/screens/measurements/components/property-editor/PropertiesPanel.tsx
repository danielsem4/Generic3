import { useTranslation } from "react-i18next";
import { Settings2 } from "lucide-react";
import { toast } from "sonner";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";
import { usePropertyEditor } from "../../hooks/canvas/usePropertyEditor";
import { useComponentVersionPanel } from "../../hooks/canvas/useComponentVersionPanel";
import { PropertyField } from "./PropertyField";
import { ComponentTypeBadge } from "../shared/ComponentTypeBadge";
import { VersionControlPanel } from "./VersionControlPanel";
import type { CorrectAnswerType, QComponentType } from "@/common/types/measurement";

export function PropertiesPanel() {
  const { t } = useTranslation();
  const { selectedComponent, propertyFields, handlePropertyChange } =
    usePropertyEditor();

  const {
    panelVersionKey,
    componentVersions,
    isReadOnly,
    variantDisplayValues,
    draftOverrides,
    setPanelVersionKey,
    handleDraftChange,
    handleBranchNewVersion,
  } = useComponentVersionPanel();

  if (!selectedComponent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Settings2 size={32} strokeWidth={1.5} />
        <p className="text-sm text-center">
          {t("measurements.builder.noSelection")}
        </p>
      </div>
    );
  }

  function getFieldValue(key: string): unknown {
    if (panelVersionKey === "v1") {
      return (selectedComponent as unknown as Record<string, unknown>)[key];
    }
    return draftOverrides[key] ?? variantDisplayValues?.[key];
  }

  function handleChange(key: string, value: unknown) {
    const currentVersionKey = useMeasurementBuilderStore.getState().panelVersionKey;
    if (currentVersionKey === "v1") {
      handlePropertyChange(key, value);
    } else {
      handleDraftChange(key, value);
    }
  }

  const correctAnswerType = getFieldValue("correctAnswerType") as
    | CorrectAnswerType
    | undefined;
  const componentType = selectedComponent.type as QComponentType;

  async function onBranchNew() {
    try {
      await handleBranchNewVersion();
    } catch {
      toast.error(t("measurements.builder.versions.branchError"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {t("measurements.builder.properties")}
        </h3>
        <ComponentTypeBadge type={selectedComponent.type} />
      </div>

      <VersionControlPanel
        versions={componentVersions}
        activeVersion={panelVersionKey}
        onVersionChange={setPanelVersionKey}
        onBranchNew={onBranchNew}
        isBusy={false}
      />

      <div className="space-y-3">
        {propertyFields.map((field) => (
          <PropertyField
            key={field.key}
            field={field}
            value={getFieldValue(field.key)}
            onChange={handleChange}
            correctAnswerType={correctAnswerType}
            componentType={componentType}
            disabled={isReadOnly}
          />
        ))}
      </div>
    </div>
  );
}
