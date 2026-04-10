import { useTranslation } from "react-i18next";
import { ArrowLeft, Trash2, Eye, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuilderTopBarProps {
  measurementName?: string;
  isDirty: boolean;
  onSave: () => void;
  onBack: () => void;
  onClear: () => void;
  onPreview: () => void;
}

export function BuilderTopBar({
  measurementName,
  isDirty,
  onSave,
  onBack,
  onClear,
  onPreview,
}: BuilderTopBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft size={16} />
          {t("measurements.builder.back")}
        </Button>
        <div className="h-6 w-px bg-border" />
        <h1 className="text-lg font-semibold">
          {measurementName ?? t("measurements.builder.title")}
        </h1>
        {isDirty && (
          <span className="h-2 w-2 rounded-full bg-amber-500" title="Unsaved" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onClear} className="gap-1">
          <Trash2 size={14} />
          {t("measurements.builder.clearCanvas")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="gap-1"
        >
          <Eye size={14} />
          {t("measurements.builder.previewMode")}
        </Button>
        <Button size="sm" onClick={onSave} className="gap-1">
          <Save size={14} />
          {t("measurements.builder.save")}
        </Button>
      </div>
    </div>
  );
}
