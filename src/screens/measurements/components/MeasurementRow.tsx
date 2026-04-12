import type React from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Copy, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IMeasurement } from "@/common/types/measurement";

interface MeasurementRowProps {
  measurement: IMeasurement;
  onEdit: (id: string) => void;
  onDelete: (q: IMeasurement) => void;
  onDuplicate: (id: string) => void;
}

export function MeasurementRow({
  measurement,
  onEdit,
  onDelete,
  onDuplicate,
}: MeasurementRowProps) {
  const { t } = useTranslation();
  const { id, name, isPublic, isActive } = measurement;

  function handleCardClick() {
    onEdit(id);
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    onEdit(id);
  }

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation();
    onDuplicate(id);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(measurement);
  }

  return (
    <Card
      className="bg-card hover:shadow-md transition-shadow border-border cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-sm font-medium">{name}</span>
          {isPublic && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {t("measurements.public")}
            </Badge>
          )}
          {isActive && (
            <Badge variant="outline" className="shrink-0 text-xs">
              {t("measurements.active")}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEdit}>
                <Pencil size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("measurements.edit")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDuplicate}>
                <Copy size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("measurements.duplicate")}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t("measurements.delete")}</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
