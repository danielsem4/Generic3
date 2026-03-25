import React from "react";
import { Settings, Edit3, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ModuleGridProps {
  modules?: string[];
  title?: string;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({ 
  modules = ["Telehealth Video Conf", "Electronic Prescriptions", "Research Patient Tracking"], 
  title = "System Modules" 
}) => {
    const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden text-left mt-6">
      
      <div className="px-6 py-4 border-b border-border bg-muted/30 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <Settings size={18} className="text-muted-foreground" />
          <h3 className="text-sm font-bold text-foreground">
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-background border border-border px-3 py-1 rounded shadow-sm">
            <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
              {modules.length} {t("nav.manage")}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-[11px] font-bold gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <Edit3 size={14} /> 
            {t("common.edit")}
          </Button>
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {modules.map((mod, idx) => (
          <div key={idx} className="flex items-center gap-3.5 p-4.5 rounded-xl border border-border/70 bg-background shadow-sm hover:bg-muted/5 transition-all">
            <div className="h-6 w-6 rounded-full bg-success/10 text-success flex items-center justify-center border border-success/20 shrink-0">
            <Check size={12} strokeWidth={3} />
           </div>
            <span className="text-xs font-bold text-foreground uppercase tracking-tight">
              {mod.replace(/_/g, ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};