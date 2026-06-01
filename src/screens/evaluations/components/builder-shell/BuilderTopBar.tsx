import { useTranslation } from "react-i18next";
import { ArrowLeft, Trash2, Eye, Save, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuilderTopBarProps {
  evaluationName?: string;
  isDirty: boolean;
  isSaving: boolean;
  versionLabels: string[];
  hasVersions: boolean;
  onSave: () => void;
  onBack: () => void;
  onClear: () => void;
  onPreview: () => void;
  onSwitchAllVersions: (label: string) => void;
}

export function BuilderTopBar({
  evaluationName,
  isDirty,
  isSaving,
  versionLabels,
  hasVersions,
  onSave,
  onBack,
  onClear,
  onPreview,
  onSwitchAllVersions,
}: BuilderTopBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between border-b bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft size={16} />
          {t("evaluations.builder.back")}
        </Button>
        <div className="h-6 w-px bg-border" />
        <h1 className="text-lg font-semibold">
          {evaluationName ?? t("evaluations.builder.title")}
        </h1>
        {isDirty && (
          <span className="h-2 w-2 rounded-full bg-amber-500" title="Unsaved" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1">
          <GitBranch size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {t("evaluations.builder.selectVersion")}
          </span>
          <select
            onChange={(e) => onSwitchAllVersions(e.target.value)}
            defaultValue=""
            disabled={!hasVersions}
            className="bg-transparent text-sm font-medium outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" disabled>
              {hasVersions ? "--" : "1"}
            </option>
            {versionLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Button variant="outline" size="sm" onClick={onClear} className="gap-1">
          <Trash2 size={14} />
          {t("evaluations.builder.clearCanvas")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="gap-1"
        >
          <Eye size={14} />
          {t("evaluations.builder.previewMode")}
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving} className="gap-1">
          <Save size={14} />
          {isSaving ? t("common.loading") : t("evaluations.builder.save")}
        </Button>
      </div>
    </div>
  );
}
