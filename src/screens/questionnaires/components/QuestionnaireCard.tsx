import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Copy, Eye, Layers, Monitor } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IQuestionnaire } from "@/common/types/questionnaire";

interface QuestionnaireCardProps {
  questionnaire: IQuestionnaire;
  onEdit: (id: string) => void;
  onDelete: (q: IQuestionnaire) => void;
  onDuplicate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function QuestionnaireCard({
  questionnaire,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: QuestionnaireCardProps) {
  const { t } = useTranslation();
  const { id, name, description, screens, createdAt, updatedAt, createdBy } =
    questionnaire;

  const totalComponents = screens.reduce(
    (sum, screen) => sum + screen.components.length,
    0,
  );
  const formattedDate = new Date(updatedAt || createdAt).toLocaleDateString();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate">{name}</CardTitle>
            {description && (
              <CardDescription className="mt-1 line-clamp-2">
                {description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            <Badge variant="secondary" className="gap-1">
              <Monitor size={12} />
              {screens.length} {t("questionnaires.screenCount")}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Layers size={12} />
              {totalComponents} {t("questionnaires.componentCount")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <span>
            {t("questionnaires.lastModified")}: {formattedDate}
          </span>
          <span>
            {t("questionnaires.createdBy")}: {createdBy}
          </span>
        </div>
      </CardContent>

      <CardFooter className="gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(id)}
          className="gap-1"
        >
          <Pencil size={14} />
          {t("questionnaires.edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPreview(id)}
          className="gap-1"
        >
          <Eye size={14} />
          {t("questionnaires.preview")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDuplicate(id)}
          className="gap-1"
        >
          <Copy size={14} />
          {t("questionnaires.duplicate")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(questionnaire)}
          className="gap-1 text-destructive hover:text-destructive"
        >
          <Trash2 size={14} />
          {t("questionnaires.delete")}
        </Button>
      </CardFooter>
    </Card>
  );
}
