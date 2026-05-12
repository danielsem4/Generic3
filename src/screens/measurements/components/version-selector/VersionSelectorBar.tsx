import { useTranslation } from "react-i18next";
import { GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface VersionSelectorBarProps {
  versions: string[];
  activeVersionKey: string;
  onSelect: (key: string) => void;
}

export function VersionSelectorBar({
  versions,
  activeVersionKey,
  onSelect,
}: VersionSelectorBarProps) {
  const { t } = useTranslation();

  if (versions.length <= 1) return null;

  return (
    <div className="flex items-center gap-2 border-b bg-card px-4 py-2">
      <GitBranch size={14} className="shrink-0 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">
        {t("measurements.builder.versions.label")}
      </span>
      <div className="flex gap-1">
        {versions.map((vk) => (
          <button
            key={vk}
            type="button"
            onClick={() => onSelect(vk)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              activeVersionKey === vk
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
          >
            {vk}
          </button>
        ))}
      </div>
    </div>
  );
}
