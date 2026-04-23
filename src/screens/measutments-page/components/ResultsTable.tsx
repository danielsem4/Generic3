import { useTranslation } from "react-i18next";
import type{ IMeasurementAnswer } from "@/common/types/measurements";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Pencil, Trash2 } from "lucide-react";


interface ResultsTableProps {
  answers: IMeasurementAnswer[];
}

export const ResultsTable = ({ answers }: ResultsTableProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto p-4" dir="ltr">
      <table className="w-full text-left border-collapse font-sans">
        <thead>
          <tr className="border-b border-border">
            <th className="pb-4 font-bold text-[11px] uppercase tracking-wider text-muted-foreground px-4">
              {t("measurements.table.question_label")}
            </th>
            <th className="pb-4 font-bold text-[11px] uppercase tracking-wider text-muted-foreground px-4">
              {t("measurements.table.answer_provided")}
            </th>
            <th className="pb-4 font-bold text-[11px] uppercase tracking-wider text-muted-foreground px-4">
              {t("measurements.table.status")}
            </th>
            <th className="pb-4 font-bold text-[11px] uppercase tracking-wider text-muted-foreground px-4">
              {t("measurements.table.grade")}
            </th>
            <th className="pb-4 font-bold text-[11px] uppercase tracking-wider text-muted-foreground px-4 text-center">
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
              <tr key={answer.id || index} className="group hover:bg-accent/30 transition-colors">
                <td className="py-6 px-4 text-[14px] font-semibold text-foreground max-w-xs leading-relaxed">
                  {answer.label}
                </td>

                <td className="py-6 px-4 text-[14px] text-muted-foreground">
                  {answer.value}
                </td>

                <td className="py-6 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium border ${
                    isExcellent 
                      ? 'bg-success/10 text-success border-success/20' 
                      : isPass 
                        ? 'bg-primary/10 text-primary border-primary/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}>
                    {isExcellent && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {isPass && <Clock className="w-3.5 h-3.5" />}
                    {isFail && <XCircle className="w-3.5 h-3.5" />}
                    
                    {isExcellent && t("measurements.status.excellent")}
                    {isPass && t("measurements.status.pass")}
                    {isFail && t("measurements.status.fail")}
                  </span>
                </td>

                <td className="py-6 px-4 text-[14px]">
                  <span className={`font-bold ${score === 0 ? 'text-destructive' : 'text-foreground'}`}>
                    {score}
                  </span>
                  <span className="text-muted-foreground font-medium"> / 100</span>
                </td>

                <td className="py-6 px-4">
                <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                   <Pencil className="h-4 w-4" />
                  </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive bg-destructive/10">
                   <Trash2 className="h-4 w-4" />
                   </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};