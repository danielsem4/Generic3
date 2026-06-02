import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EvaluationType } from "@/common/types/evaluation";
import type { IEvaluation } from "@/common/types/evaluation";
import { EvaluationRow } from "./EvaluationRow";

const TYPE_I18N_KEY: Record<EvaluationType, string> = {
  [EvaluationType.QUESTIONNAIRES]: "evaluations.types.questionnaries",
  [EvaluationType.COGNITIVE_TESTS]: "evaluations.types.cognitiveTests",
  [EvaluationType.MODULE_QUESTIONNAIRE]: "evaluations.types.moduleQuestionnaire",
  [EvaluationType.MEDICAL_STAFF_EVALUATION]: "evaluations.types.medicalStaffEvaluation",
};

interface EvaluationTypeColumnProps {
  type: EvaluationType;
  evaluations: IEvaluation[];
  onEdit: (id: string) => void;
  onEditMetadata: (m: IEvaluation) => void;
  onDelete: (q: IEvaluation) => void;
  onDuplicate: (id: string) => void;
  readOnly?: boolean;
}

export function EvaluationTypeColumn({
  type,
  evaluations,
  onEdit,
  onEditMetadata,
  onDelete,
  onDuplicate,
  readOnly,
}: EvaluationTypeColumnProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t(TYPE_I18N_KEY[type])}</CardTitle>
          <Badge variant="secondary">{evaluations.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="max-h-[60vh] overflow-y-auto pt-0">
        {evaluations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            {t("evaluations.emptyColumn")}
          </p>
        ) : (
          <div className="space-y-2">
            {evaluations.map((m) => (
              <EvaluationRow
                key={m.id}
                evaluation={m}
                onEdit={onEdit}
                onEditMetadata={onEditMetadata}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
