import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IModule } from "@/common/types/patientDetails";
import { getModuleConfig } from "../moduleConfig";
import { ACCENT_STYLES } from "./accentStyles";

interface Props {
  module: IModule;
  onEdit: (module: IModule) => void;
  onDelete: (module: IModule) => void;
}

export function AdminModuleCard({ module, onEdit, onDelete }: Props) {
  const { t } = useTranslation();
  const normalizedName = module.module_name.toLowerCase();
  const config = getModuleConfig(normalizedName);
  const s = ACCENT_STYLES[config.accent];
  const Icon = config.icon;

  return (
    <Card
      className={[
        "w-full rounded-2xl border border-border bg-card text-card-foreground",
        "shadow-sm p-6 flex flex-col gap-4",
        s.border,
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
          <Icon className={`h-5 w-5 ${s.iconText}`} />
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(module)}
            aria-label={t("modules.editModule")}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(module)}
            aria-label={t("modules.deleteTitle")}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold">{module.module_name}</h3>
        {module.description && (
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {module.description}
          </p>
        )}
      </div>
    </Card>
  );
}
