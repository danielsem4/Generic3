import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import type { IEvaluation } from "@/common/types/evaluation";
import type { IEvaluationGroup } from "../../hooks/list-page/useEvaluations";
import { EvaluationTypeColumn } from "./EvaluationTypeColumn";

interface EvaluationListProps {
  groups: IEvaluationGroup[];
  onEdit: (id: string) => void;
  onEditMetadata: (m: IEvaluation) => void;
  onDelete: (q: IEvaluation) => void;
  onDuplicate: (id: string) => void;
  readOnly?: boolean;
}

export function EvaluationList({
  groups,
  onEdit,
  onEditMetadata,
  onDelete,
  onDuplicate,
  readOnly,
}: EvaluationListProps) {
  const { t } = useTranslation();

  if (groups.every((g) => g.evaluations.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
        <FileText size={48} strokeWidth={1.5} />
        <p className="text-lg">{t("evaluations.noData")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <EvaluationTypeColumn
          key={group.type}
          type={group.type}
          evaluations={group.evaluations}
          onEdit={onEdit}
          onEditMetadata={onEditMetadata}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
}
