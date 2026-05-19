import { Card } from "@/components/ui/card";
import type { AnalyticsItem } from "../hooks/useAnalyticsPage";
import { ANALYTICS_ACCENT_STYLES } from "./analyticsAccentStyles";

interface AnalyticsCardProps {
  item: AnalyticsItem;
  title: string;
  description: string;
}

export function AnalyticsCard({
  item,
  title,
  description,
}: Readonly<AnalyticsCardProps>) {
  const Icon = item.icon;
const s = ANALYTICS_ACCENT_STYLES[item.accent] || {
    border: "border-l-4 border-l-slate-300",
    iconBg: "bg-slate-100",
    iconText: "text-slate-500",
  };
  
  return (
    <Card
      className={[
        "w-full rounded-2xl border border-border bg-card text-card-foreground",
        "shadow-sm hover:shadow-md transition-all duration-200 ease-in-out",
        "hover:-translate-y-1",
        "p-6",
        s.border,
      ].join(" ")}
    >
      <div className="flex items-start justify-end">
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