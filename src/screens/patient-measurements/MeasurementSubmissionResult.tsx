import { useTranslation } from "react-i18next";
import { CheckCircle2, XCircle } from "lucide-react";
import { useMeasurementSubmissionResult } from "./hooks/useMeasurementSubmissionResult";
import { CognitiveAnswerRow } from "./components/CognitiveAnswerRow";
import type { ISubmissionAnswer } from "@/common/types/measurement";

export default function MeasurementSubmissionResult() {
  const { t } = useTranslation();
  const { submission, isCognitiveTest, isLoading, isError } =
    useMeasurementSubmissionResult();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t("common.loading")}
      </div>
    );
  }

  if (isError || !submission) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        {t("measurements.results.noData")}
      </div>
    );
  }

  const submittedDate = new Date(submission.submitted_at).toLocaleString();

  const totalScore = isCognitiveTest
    ? submission.answers.reduce((sum, a) => sum + (a.points_earned ?? 0), 0)
    : submission.score;

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <p className="text-sm text-muted-foreground">
        {t("measurements.results.submittedAt")}: {submittedDate}
      </p>

      {totalScore !== null && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">{t("measurements.results.score")}</p>
          <p className="text-4xl font-bold mt-1">{totalScore}</p>
        </div>
      )}

      <div className="rounded-lg border bg-card p-4">
        {isCognitiveTest
          ? submission.answers.map((answer) => (
              <CognitiveAnswerRow key={answer.element.id} answer={answer} />
            ))
          : submission.answers.map((answer) => (
              <RegularAnswerRow key={answer.element.id} answer={answer} />
            ))}
      </div>
    </div>
  );
}

function RegularAnswerRow({ answer }: { answer: ISubmissionAnswer }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="space-y-0.5 flex-1">
        <p className="text-sm font-medium">{answer.element.label}</p>
        <p className="text-sm text-muted-foreground">{String(answer.value ?? "—")}</p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        {answer.is_correct !== null && (
          answer.is_correct
            ? <CheckCircle2 size={18} className="text-green-500" />
            : <XCircle size={18} className="text-destructive" />
        )}
        {answer.points_earned !== null && (
          <span className="text-sm text-muted-foreground">{answer.points_earned}pt</span>
        )}
      </div>
    </div>
  );
}
