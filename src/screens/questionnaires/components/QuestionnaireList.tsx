import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { IQuestionnaire } from "@/common/types/questionnaire";
import { QuestionnaireCard } from "./QuestionnaireCard";

interface QuestionnaireListProps {
  questionnaires: IQuestionnaire[];
  onEdit: (id: string) => void;
  onDelete: (q: IQuestionnaire) => void;
  onDuplicate: (id: string) => void;
  onPreview: (id: string) => void;
}

export function QuestionnaireList({
  questionnaires,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}: QuestionnaireListProps) {
  const { t } = useTranslation();

  if (questionnaires.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
        <FileText size={48} strokeWidth={1.5} />
        <p className="text-lg">{t("questionnaires.noData")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {questionnaires.map((q) => (
        <QuestionnaireCard
          key={q.id}
          questionnaire={q}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
