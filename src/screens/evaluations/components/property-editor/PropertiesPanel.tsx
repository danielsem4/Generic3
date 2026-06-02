import { useTranslation } from "react-i18next";
import { Settings2 } from "lucide-react";
import { usePropertyEditor } from "../../hooks/canvas/usePropertyEditor";
import { useVersionControl } from "../../hooks/canvas/useVersionControl";
import { PropertyField } from "./PropertyField";
import { VersionControlSection } from "./VersionControlSection";
import { ComponentTypeBadge } from "../shared/ComponentTypeBadge";
import type { CorrectAnswerType, QComponentType } from "@/common/types/evaluation";

export function PropertiesPanel() {
  const { t } = useTranslation();
  const { selectedComponent, propertyFields, handlePropertyChange } =
    usePropertyEditor();
  const {
    versions,
    activeVersionId,
    handleBranchVersion,
    handleSwitchVersion,
    handleDeleteVersion,
  } = useVersionControl();

  if (!selectedComponent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
        <Settings2 size={32} strokeWidth={1.5} />
        <p className="text-sm text-center">
          {t("evaluations.builder.noSelection")}
        </p>
      </div>
    );
  }

  const correctAnswerType =
    (selectedComponent as unknown as Record<string, unknown>).correctAnswerType as CorrectAnswerType | undefined;
  const componentType = selectedComponent.type as QComponentType;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {t("evaluations.builder.properties")}
        </h3>
        <ComponentTypeBadge type={selectedComponent.type} />
      </div>

      <VersionControlSection
        versions={versions}
        activeVersionId={activeVersionId}
        onBranch={handleBranchVersion}
        onSwitch={handleSwitchVersion}
        onDelete={handleDeleteVersion}
      />

      <div className="space-y-3">
        {propertyFields.map((field) => (
          <PropertyField
            key={field.key}
            field={field}
            value={(selectedComponent as unknown as Record<string, unknown>)[field.key]}
            onChange={handlePropertyChange}
            correctAnswerType={correctAnswerType}
            componentType={componentType}
          />
        ))}
      </div>
    </div>
  );
}
