import { useTranslation } from "react-i18next";
import type { IMeasurementAnswer } from "@/common/types/measurements";

export const useAnalytics = (answers: IMeasurementAnswer[]) => {
  const { t } = useTranslation();
  const total = answers.length;
  const passedCount = answers.filter(a => a.is_correct).length;
  const failedCount = total - passedCount;
  
  const avgGrade = total > 0 
    ? Math.round((answers.reduce((acc, curr) => acc + (curr.points_earned ?? 0), 0) / (total * 100)) * 100) 
    : 0;
    
  const passRate = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  const distributionData = [
    { range: '0-59', count: answers.filter(a => (a.points_earned ?? 0) < 60).length, fill: '#ef4444' },
    { range: '60-79', count: answers.filter(a => (a.points_earned ?? 0) >= 60 && (a.points_earned ?? 0) < 80).length, fill: '#f59e0b' },
    { range: '80-89', count: answers.filter(a => (a.points_earned ?? 0) >= 80 && (a.points_earned ?? 0) < 90).length, fill: '#3b82f6' },
    { range: '90-100', count: answers.filter(a => (a.points_earned ?? 0) >= 90).length, fill: '#10b981' },
  ];

  const pieData = [
    { name: t("measurements.analytics.pass"), value: passedCount, color: '#10b981' },
    { name: t("measurements.analytics.fail"), value: failedCount, color: '#ef4444' },
  ];

  return { avgGrade, passRate, distributionData, pieData, total, passedCount, failedCount };
};