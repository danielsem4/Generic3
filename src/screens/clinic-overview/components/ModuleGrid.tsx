import React from "react";
import { Settings, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IClinicModule } from "@/common/types/clinic";

interface ModuleGridProps {
  modules?: IClinicModule[];
  title?: string;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  modules = [],
  title,
}) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-left mt-6">

      <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <Settings size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            {title ?? t("clinic.systemModules")}
          </h3>
        </div>

        <div className="bg-background border border-border px-3 py-1 rounded shadow-sm">
          <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
            {modules.length} {t("nav.manage")}
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((mod) => (
          <div key={mod.id} className="flex items-start gap-3.5 p-4 rounded-xl border border-border/70 bg-background shadow-sm hover:bg-muted/5 transition-all">
            <div className="h-6 w-6 rounded-full bg-success/10 text-success flex items-center justify-center border border-success/20 shrink-0 mt-0.5">
              <Check size={12} strokeWidth={3} />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-foreground uppercase tracking-tight block">
                {mod.module_name}
              </span>
              {mod.module_description && (
                <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5 truncate">
                  {mod.module_description}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
