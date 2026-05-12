import { useTranslation } from "react-i18next";
import type { IMeasurementSubmissionAnswerRaw } from "@/common/types/patientMeasurementSubmission";

export const useAnalytics = (answers: IMeasurementSubmissionAnswerRaw[]) => {
  const { t } = useTranslation();
  const total = answers.length;
  const passedCount = answers.filter((a) => (a.points_earned ?? 0) > 0).length;
  const failedCount = answers.filter((a) => (a.points_earned ?? 0) === 0).length;
  const avgGrade =
    total > 0
      ? Math.round(
          answers.reduce((acc, curr) => acc + (curr.points_earned || 0), 0) /
            total,
        )
      : 0;
  const passRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  const distributionData = [
    { range: "0-59", count: answers.filter((a) => (a.points_earned ?? 0) < 60).length, fill: "oklch(var(--chart-4))" },
    { range: "60-79", count: answers.filter((a) => (a.points_earned ?? 0) >= 60 && (a.points_earned ?? 0) < 80).length, fill: "oklch(var(--chart-3))" },
    { range: "80-89", count: answers.filter((a) => (a.points_earned ?? 0) >= 80 && (a.points_earned ?? 0) < 90).length, fill: "oklch(var(--chart-1))" },
    { range: "90-100", count: answers.filter((a) => (a.points_earned ?? 0) >= 90).length, fill: "oklch(var(--chart-2))" },
  ];

  const pieData = [
    { name: t("measurements.analytics.pass"), value: passedCount, color: "oklch(var(--success))" },
    { name: t("measurements.analytics.fail"), value: failedCount, color: "oklch(var(--destructive))" },
  ];

  return { avgGrade, passRate, distributionData, pieData, total, passedCount, failedCount };
};
