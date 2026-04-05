import React from "react";
import { Activity, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import type { IClinicActivity } from "@/common/types/activities";

interface Props {
  activity: IClinicActivity;
  isManager: boolean;
  index: number;
  onViewDetails?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ActivityItem: React.FC<Props> = ({
  activity,
  isManager,
  index,
  onViewDetails,
  onDelete,
}) => {
  const { t } = useTranslation();
  const colorVar = `var(--chart-${(index % 5) + 1})`;

  const handleClick = () => {
    onViewDetails?.(activity.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(activity.id);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 bg-card border border-border/50 rounded-2xl mb-3 hover:shadow-md cursor-pointer group transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl transition-colors"
          style={{ backgroundColor: `color-mix(in oklch, ${colorVar}, transparent 10%)` }}
        >
          <Activity size={22} strokeWidth={2.5} style={{ color: colorVar }} />
        </div>

        <div className="text-left">
          <h3 className="font-bold text-foreground text-lg leading-tight">
            {activity.activity_name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {activity.activity_description || t("common.noDescription")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isManager && (
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 rounded-full z-10"
            onClick={handleDelete}
          >
            <Trash2 size={18} />
          </Button>
        )}

        <div className="p-1">
          <ChevronRight
            size={18}
            className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all"
          />
        </div>
      </div>
    </div>
  );
};
