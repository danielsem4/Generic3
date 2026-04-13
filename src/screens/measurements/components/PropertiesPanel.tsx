import { useTranslation } from "react-i18next";
import { Settings2 } from "lucide-react";
import { usePropertyEditor } from "../hooks/usePropertyEditor";
import { PropertyField } from "./PropertyField";
import { ComponentTypeBadge } from "./ComponentTypeBadge";

export function PropertiesPanel() {
  const { t } = useTranslation();
  const { selectedComponent, propertyFields, handlePropertyChange } =
    usePropertyEditor();

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          {t("measurements.builder.properties")}
        </h3>
        <ComponentTypeBadge type={selectedComponent.type} />
      </div>

      <div className="space-y-3">
        {propertyFields.map((field) => (
          <PropertyField
            key={field.key}
            field={field}
            value={(selectedComponent as unknown as Record<string, unknown>)[field.key]}
            onChange={handlePropertyChange}
          />
        ))}
      </div>
    </div>
  );
}
