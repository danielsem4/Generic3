import { useTranslation } from "react-i18next";
import { ArrowLeft, Trash2, Eye, Save, GitBranch, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuilderTopBarProps {
  measurementName?: string;
  isDirty: boolean;
  isSaving: boolean;
  isLocked?: boolean;
  versions?: string[];
  globalPreviewVersion?: string;
  onGlobalVersionChange?: (version: string) => void;
  onSave: () => void;
  onBack: () => void;
  onClear: () => void;
  onPreview: () => void;
}

export function BuilderTopBar({
  measurementName,
  isDirty,
  isSaving,
  isLocked,
  versions,
  globalPreviewVersion = "v1",
  onGlobalVersionChange,
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
        {isLocked && (
          <div className="flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-xs text-amber-700">
            <Lock size={11} />
            {t("measurements.builder.versions.lockedMode")}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {versions && versions.length > 1 && (
          <div className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1">
            <GitBranch size={13} className="text-muted-foreground shrink-0" />
            <select
              value={globalPreviewVersion}
              onChange={(e) => onGlobalVersionChange?.(e.target.value)}
              className="bg-transparent text-xs font-medium outline-none cursor-pointer"
            >
              {versions.map((v) => {
                const num = v.match(/^v(\d+)$/)?.[1];
                const label = num ? `${t("measurements.builder.versions.version")} ${num}` : v;
                return (
                  <option key={v} value={v}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
        )}
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
        <Button size="sm" onClick={onSave} disabled={isSaving} className="gap-1">
          <Save size={14} />
          {isSaving ? t("common.loading") : t("measurements.builder.save")}
        </Button>
      </div>
    </div>
  );
}
