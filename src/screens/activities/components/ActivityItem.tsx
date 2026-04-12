import React from "react";
import { Dumbbell, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IGlobalActivity } from "@/common/types/activities";

interface Props {
  activity: IGlobalActivity;
  isManager: boolean;
  onDelete?: (id: string) => void;
}

export const ActivityItem: React.FC<Props> = ({
  activity,
  isManager,
  onDelete,
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(activity.id);
  };

  return (
    <Card className="bg-card hover:shadow-md transition-shadow border-border">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Dumbbell size={18} className="text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate">
            {activity.activity_name}
          </span>
        </div>
        {isManager && onDelete && (
          <button
            type="button"
            className="text-muted-foreground hover:text-destructive transition-colors ml-2"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        )}
      </CardContent>
    </Card>
  );
};