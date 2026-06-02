import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IEvaluationSubmissionAnswerRaw } from "@/common/types/patientEvaluationSubmission";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Pencil } from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DeleteButton } from "@/common/components/DeleteButton";
import { EditAnswerScoreDialog } from "./EditAnswerScoreDialog";

interface ResultsTableProps {
  answers: IEvaluationSubmissionAnswerRaw[];
  onDelete: (id: string) => void;
  onEditScore: (id: string, score: number) => void;
}

export const ResultsTable = ({
  answers,
  onDelete,
  onEditScore,
}: ResultsTableProps) => {
  const { t } = useTranslation();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editAnswer, setEditAnswer] =
    useState<IEvaluationSubmissionAnswerRaw | null>(null);

  const handleOpenEdit = (answer: IEvaluationSubmissionAnswerRaw) => {
    setEditAnswer(answer);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) onDelete(deleteId);
  };

  const handleCloseDelete = () => {
    setDeleteId(null);
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) setEditAnswer(null);
  };

  return (
    <div className="w-full overflow-x-auto p-4">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("evaluations.table.question_label")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("evaluations.table.answer_provided")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("evaluations.table.status")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("evaluations.table.grade")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground text-center">
              {t("evaluations.table.actions")}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border/50">
          {answers.map((answer, index) => {
            const score = answer.points_earned ?? 0;
            const isExcellent = answer.is_correct;
            const isPass = !isExcellent && score > 0;
            const isFail = !isExcellent && score === 0;

            return (
              <tr key={answer.id || index} className="hover:bg-accent/30">
                <td className="py-6 px-4 font-semibold text-[14px]">
                  {answer.label}
                </td>

                <td className="py-6 px-4 text-muted-foreground text-[14px]">
                  {Array.isArray(answer.value)
                    ? answer.value.join(", ")
                    : String(answer.value ?? "-")}
                </td>

                <td className="py-6 px-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] border ${
                      isExcellent
                        ? "bg-success/10 text-success border-success/20"
                        : isPass
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {isExcellent && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isPass && <Clock className="w-3.5 h-3.5" />}
                    {isFail && <XCircle className="w-3.5 h-3.5" />}

                    {isExcellent && t("evaluations.status.excellent")}
                    {isPass && t("evaluations.status.pass")}
                    {isFail && t("evaluations.status.fail")}
                  </span>
                </td>

                <td className="py-6 px-4 text-[14px]">
                  <span
                    className={`font-bold ${
                      score === 0 ? "text-destructive" : ""
                    }`}
                  >
                    {score}
                  </span>
                </td>

                <td className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenEdit(answer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <DeleteButton onClick={() => handleOpenDelete(answer.id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={handleCloseDelete}
        title={t("evaluations.deleteConfirm.title")}
        description={t("evaluations.deleteConfirm.description")}
        confirmLabel={t("evaluations.deleteConfirm.confirm")}
        cancelLabel={t("evaluations.deleteConfirm.cancel")}
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />

      <EditAnswerScoreDialog
        open={!!editAnswer}
        answer={editAnswer}
        onOpenChange={handleEditDialogChange}
        onSave={onEditScore}
      />
    </div>
  );
};
