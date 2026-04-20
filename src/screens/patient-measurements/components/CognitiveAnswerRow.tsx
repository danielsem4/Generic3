import { useTranslation } from "react-i18next";
import type { ISubmissionAnswer } from "@/common/types/measurement";

interface CognitiveAnswerRowProps {
  answer: ISubmissionAnswer;
}

function formatValue(value: unknown, dataType: string, yes: string, no: string): string {
  if (value === null || value === undefined) return "—";
  if (dataType === "boolean") return value ? yes : no;
  if (dataType === "list") {
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  }
  return String(value);
}

export function CognitiveAnswerRow({ answer }: CognitiveAnswerRowProps) {
  const { t } = useTranslation();
  const config = answer.element.config;
  const dataType = typeof config.data_type === "string" ? config.data_type : "text";

  const yes = t("measurements.results.yes");
  const no = t("measurements.results.no");
  const formatted = formatValue(answer.value, dataType, yes, no);

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <p className="text-sm font-medium">{answer.element.label}</p>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{formatted}</span>
        {answer.points_earned !== null && (
          <span className="text-sm font-medium tabular-nums">
            {answer.points_earned}pt
          </span>
        )}
      </div>
    </div>
  );
}
