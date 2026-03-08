import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import type { ModuleItem } from "../hooks/useModules";
import { ACCENT_STYLES } from "./accentStyles";

interface ModuleCardProps {
  item: ModuleItem;
  title: string;
  description: string;
}

export function ModuleCard({
  item,
  title,
  description,
}: Readonly<ModuleCardProps>) {
  const Icon = item.icon;
  const s = ACCENT_STYLES[item.accent];

  return (
    <Card
      className={[
        "w-full rounded-2xl border border-border bg-card text-card-foreground",
        "shadow-sm hover:shadow-md transition-all duration-200 ease-in-out",
        "hover:-translate-y-1",
        "p-6",
        s.border,
        item.gridClassName ?? "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-full p-1 text-muted-foreground">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </div>

        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
          <Icon className={`h-5 w-5 ${s.iconText}`} />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed min-h-12">
          {description}
        </p>
      </div>
    </Card>
  );
}