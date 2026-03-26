import React from "react";
import { useTranslation } from "react-i18next";
import { Building2, Loader2 } from "lucide-react"; 
import { useClinicOverview } from "./hooks/useClinicOverview";
import { ClinicInfoCard } from "./components/ClinicInfoCard";
import { ManagerCard } from "./components/ManagerCard";
import { ModuleGrid } from "./components/ModuleGrid";
import { ClinicEditCard } from "./components/ClinicEditCard";


export default function ClinicOverview() {
  const { t } = useTranslation();
  const { clinic, manager, isLoading, isManager } = useClinicOverview();
    const [isEditing, setIsEditing] = React.useState(false);


  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!clinic) return <div className="p-10 text-center font-bold text-muted-foreground">{t("clinic.noData")}</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 text-left" dir="ltr">
      
      <div className="mb-10 space-y-1">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shadow-sm">
            <Building2 size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
              {t("clinic.Title")}
            </h1>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-medium ps-13">
          {t("clinic.readOnlyView")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {isEditing ? (
          <ClinicEditCard
            clinic={clinic}
            onCancel={() => setIsEditing(false)}
            onSave={() => setIsEditing(false)}
          />
        ) : (
          <ClinicInfoCard
            clinic={clinic}
            isManager={isManager}
            onEdit={isManager ? () => setIsEditing(true) : undefined}
    />
  )}

  <ManagerCard manager={manager} />

</div>
 
      <ModuleGrid 
        modules={clinic.available_modules} 
        title={t("clinic.systemModules")} 
      />
    </div>
  );
}