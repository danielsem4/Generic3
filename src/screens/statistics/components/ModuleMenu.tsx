import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import type { IModuleStatistics } from "@/common/types/statistics";

interface IModuleMenuProps {
  modules: IModuleStatistics[];
  selectedModuleId: number | null;
  onSelect: (moduleId: number) => void;
}

export function ModuleMenu({
  modules,
  selectedModuleId,
  onSelect,
}: IModuleMenuProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="font-semibold text-sm text-muted-foreground mb-3">
        {t("statistics.modules")} ({modules.length})
      </h3>
      <nav className="flex flex-col gap-1">
        {modules.map((mod) => (
          <button
            key={mod.module_id}
            onClick={() => onSelect(mod.module_id)}
            className={cn(
              "text-left px-3 py-2 rounded-lg text-sm transition-colors",
              mod.module_id === selectedModuleId
                ? "bg-primary text-primary-foreground font-medium"
                : "hover:bg-muted",
            )}
          >
            {mod.module_name}
          </button>
        ))}
      </nav>
    </div>
  );
}
