import { useTranslation } from "react-i18next";
import { GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VersionControlPanelProps {
  versions: string[];
  activeVersion: string;
  onVersionChange: (vk: string) => void;
  onBranchNew: () => void;
  isBusy: boolean;
}

export function VersionControlPanel({
  versions,
  activeVersion,
  onVersionChange,
  onBranchNew,
  isBusy,
}: VersionControlPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border bg-muted/40 p-3 space-y-2.5">
      <div className="flex items-center gap-1.5">
        <GitBranch size={13} className="text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("measurements.builder.versions.versionControl")}
        </span>
      </div>

      <select
        value={activeVersion}
        onChange={(e) => onVersionChange(e.target.value)}
        className="w-full h-8 rounded-md border border-input bg-background px-2 text-sm font-mono"
      >
        {versions.map((vk) => (
          <option key={vk} value={vk}>
            {vk}
          </option>
        ))}
      </select>

      <Button
        variant="outline"
        size="sm"
        className="w-full h-7 gap-1.5 text-xs"
        onClick={onBranchNew}
        disabled={isBusy}
      >
        <GitBranch size={12} />
        {t("measurements.builder.versions.branchNew")}
      </Button>
    </div>
  );
}
