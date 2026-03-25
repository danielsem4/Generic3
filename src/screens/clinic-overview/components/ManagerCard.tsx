import React from "react";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Mail, Phone } from "lucide-react"
import type { IClinicManager } from "@/common/types/clinic";
import { useTranslation } from "react-i18next";

interface ManagerCardProps {
  manager?: IClinicManager;
}

export const ManagerCard: React.FC<ManagerCardProps> = ({ manager }) => {
  const { t } = useTranslation();

  const displayName = manager?.first_name 
    ? `${manager.first_name} ${manager.last_name}` 
    : t("common.na");

  const initials = manager?.first_name 
    ? `${manager.first_name.charAt(0)}${manager.last_name?.charAt(0)}` 
    : t("common.na");

  return (
    <Card className="p-8 border-none shadow-md flex flex-col items-center text-center justify-between space-y-4 h-full bg-card rounded-xl animate-in fade-in duration-500">
      <div className="w-full flex justify-start items-center gap-2 mb-2">
        <ShieldCheck size={16} className="text-muted-foreground" />
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          {t("clinic.managerTitle")}
        </p>
      </div>

      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-black border-4 border-background shadow-lg uppercase tracking-tight">
        {initials}
      </div>

      <div>
        <h3 className="text-xl font-bold text-foreground">
          {displayName}
        </h3>
        <p className="text-xs font-bold text-primary uppercase tracking-tighter">
          {t("clinic.primaryAdmin")}
        </p>
      </div>

      <div className="w-full space-y-2 pt-4">
        <div className="bg-secondary/50 p-3 rounded-xl flex items-center gap-3 text-sm font-medium border border-border/40 overflow-hidden">
          <Mail size={14} className="text-muted-foreground shrink-0" />
          <span className="truncate">
            {manager?.email || t("common.na")}
          </span>
        </div>

        <div className="bg-secondary/50 p-3 rounded-xl flex items-center gap-3 text-sm font-medium border border-border/40">
          <Phone size={14} className="text-muted-foreground shrink-0" />
          <span>
            {manager?.phone_number || t("common.na")}
          </span>
        </div>
      </div>
    </Card>
  );
};