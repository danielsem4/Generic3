import { useTranslation } from "react-i18next";
import type { IMeasurementSubmissionAnswerRaw } from "@/common/types/patientMeasurementSubmission";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Pencil } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DeleteButton } from "@/common/components/DeleteButton";
import { EditAnswerScoreDialog } from "./EditAnswerScoreDialog";

interface ResultsTableProps {
  answers: IMeasurementSubmissionAnswerRaw[];
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
    useState<IMeasurementSubmissionAnswerRaw | null>(null);

  return (
    <div className="w-full overflow-x-auto p-4" dir="ltr">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("measurements.table.question_label")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("measurements.table.answer_provided")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("measurements.table.status")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground">
              {t("measurements.table.grade")}
            </th>
            <th className="pb-4 px-4 text-[11px] font-bold uppercase text-muted-foreground text-center">
              {t("measurements.table.actions")}
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

                    {isExcellent && t("measurements.status.excellent")}
                    {isPass && t("measurements.status.pass")}
                    {isFail && t("measurements.status.fail")}
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
                  <span className="text-muted-foreground"> / 100</span>
                </td>

                <td className="py-6 px-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditAnswer(answer)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <DeleteButton onClick={() => setDeleteId(answer.id)} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* DELETE */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title={t("measurements.deleteConfirm.title")}
        description={t("measurements.deleteConfirm.description")}
        confirmLabel={t("measurements.deleteConfirm.confirm")}
        cancelLabel={t("measurements.deleteConfirm.cancel")}
        onConfirm={() => {
          if (deleteId) onDelete(deleteId);
          setDeleteId(null);
        }}
        variant="destructive"
      />

      {/* EDIT */}
      <EditAnswerScoreDialog
        open={!!editAnswer}
        answer={editAnswer}
        onOpenChange={(open) => {
          if (!open) setEditAnswer(null);
        }}
        onSave={onEditScore}
      />
    </div>
  );
};