import { useTranslation } from "react-i18next";
import { GitBranch, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { IQComponentVersion } from "@/common/types/evaluation";

interface VersionControlSectionProps {
  versions: IQComponentVersion[];
  activeVersionId: string | null;
  onBranch: () => void;
  onSwitch: (versionId: string) => void;
  onDelete: (versionId: string) => void;
}

export function VersionControlSection({
  versions,
  activeVersionId,
  onBranch,
  onSwitch,
  onDelete,
}: VersionControlSectionProps) {
  const { t } = useTranslation();

  function handleVersionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onSwitch(e.target.value);
  }

  function handleDelete() {
    if (!activeVersionId) return;
    onDelete(activeVersionId);
  }

  return (
    <div className="space-y-3">
      <Separator />
      <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
        {t("evaluations.builder.versionControl")}
      </h4>

      {versions.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <select
              value={activeVersionId ?? ""}
              onChange={handleVersionChange}
              className="flex-1 rounded-md border bg-background px-2 py-1.5 text-sm"
            >
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.versionLabel}
                  {v.id === activeVersionId
                    ? ` (${t("evaluations.builder.activeVersion")})`
                    : ""}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              disabled={versions.length <= 1}
              title={t("evaluations.builder.deleteVersion")}
            >
              <Trash2 size={14} className="text-destructive" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onBranch}
          >
            <GitBranch size={14} />
            {t("evaluations.builder.branchVersion")}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {t("evaluations.builder.noVersions")}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onBranch}
          >
            <GitBranch size={14} />
            {t("evaluations.builder.branchVersion")}
          </Button>
        </div>
      )}
    </div>
  );
}
