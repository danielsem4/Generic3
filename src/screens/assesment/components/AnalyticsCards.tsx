import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  colorClass: string;
  iconColor: string;
}

export const StatCard = ({ title, value, subValue, icon: Icon, colorClass, iconColor }: StatCardProps) => (
  <Card className="p-6 border-border shadow-sm bg-background/50">
    <div className="flex items-center gap-5">
      <div className={`p-4 rounded-xl ${colorClass} flex-shrink-0`}>
        <Icon className={`w-8 h-8 ${iconColor}`} />
      </div>
      <div className="flex flex-col items-start text-left">
        <p className="text-sm text-muted-foreground font-semibold mb-2">{title}</p>
        <h3 className="text-3xl font-black text-foreground leading-none">
          {value} {subValue && <span className="text-xl text-muted-foreground font-bold">{subValue}</span>}
        </h3>
      </div>
    </div>
  </Card>
);