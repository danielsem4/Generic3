import type React from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Copy, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IEvaluation } from "@/common/types/evaluation";

interface EvaluationRowProps {
  evaluation: IEvaluation;
  onEdit: (id: string) => void;
  onEditMetadata: (m: IEvaluation) => void;
  onDelete: (q: IEvaluation) => void;
  onDuplicate: (id: string) => void;
  readOnly?: boolean;
}

export function EvaluationRow({
  evaluation,
  onEdit,
  onEditMetadata,
  onDelete,
  onDuplicate,
  readOnly,
}: EvaluationRowProps) {
  const { t } = useTranslation();
  const { id, name, isPublic, isActive } = evaluation;

  function handleCardClick() {
    onEdit(id);
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    onEditMetadata(evaluation);
  }

  function handleDuplicate(e: React.MouseEvent) {
    e.stopPropagation();
    onDuplicate(id);
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete(evaluation);
  }

  return (
    <Card
      className={cn("bg-card hover:shadow-md transition-shadow border-border", !readOnly && "cursor-pointer")}
      onClick={readOnly ? undefined : handleCardClick}
    >
      <CardContent className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-sm font-medium">{name}</span>
          {isPublic && (
            <Badge variant="secondary" className="shrink-0 text-xs">
              {t("evaluations.public")}
            </Badge>
          )}
          {isActive && (
            <Badge variant="outline" className="shrink-0 text-xs">
              {t("evaluations.active")}
            </Badge>
          )}
        </div>

        {!readOnly && (
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleEdit}>
                  <Pencil size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("evaluations.edit")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDuplicate}>
                  <Copy size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("evaluations.duplicate")}</TooltipContent>
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
              <TooltipContent>{t("evaluations.delete")}</TooltipContent>
            </Tooltip>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
