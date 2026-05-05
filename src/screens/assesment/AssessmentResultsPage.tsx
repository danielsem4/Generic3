import React, { useState, useEffect } from 'react'; 
import { useTranslation } from "react-i18next";
import { useAssessmentResults } from "./hooks/useAssessmentResults";
import { ResultsTable } from "./components/ResultsTable";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List } from "lucide-react";
import { AnalyticsView } from "./components/AnalyticsView";
import type { AssessmentAnswer } from '@/api/assesmentApi';

export const AssessmentResultsPage = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"list" | "analytics">("list");
  
  const { submission, stats, isLoading, error } = useAssessmentResults();

  useEffect(() => {
    if (submission) console.log("✅ Submission loaded:", submission);
    if (error) console.error("❌ API Error:", error);
  }, [submission, error]);

  if (isLoading) {
    return <div className="p-20 text-center font-bold text-slate-500">{t("common.loading", "Loading Data...")}</div>;
  }

  // תיקון: בדיקה אם submission קיים ואם יש לו id
  if (error || !submission || !submission.id) {
    return (
      <div className="p-20 text-center text-red-500 bg-red-50 rounded-xl border border-red-200 m-6">
        <h2 className="text-xl font-bold mb-2">{t("measurements.error_title", "Error: Submission not found")}</h2>
        <p className="text-sm">{t("measurements.error_desc", "Please check if the IDs are valid.")}</p>
      </div>
    );
  }

  const displayAnswers: AssessmentAnswer[] = submission.answers || [];

  return (
    <div className="min-h-screen bg-slate-50/50" dir={t("direction", "ltr")}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
          <div className="text-left">
            <h1 className="text-2xl font-black text-slate-900">
              {submission.measurement_name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {t(`measurements.frequency.${(stats?.frequency || "once").toLowerCase()}`, stats?.frequency || "Once")}
              </span>
              <p className="text-slate-400 text-xs font-medium">
                {t("measurements.submitted_at", "Submitted at")}: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>

          {/* Score */}
          <div className="bg-slate-900 text-white px-6 py-3 rounded-xl flex items-baseline gap-2 shadow-lg">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                {t("measurements.score", "Score")}:
            </span>
            <span className="text-2xl font-black">{stats?.score ?? 0}</span>
            <span className="text-slate-500 font-bold">/ {stats?.maxScore ?? 0}</span>
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <Button 
              variant="ghost" 
              onClick={() => setViewMode("list")}
              className={`px-6 py-2 text-xs gap-2 transition-all rounded-lg font-bold ${
                viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-slate-500"
              }`}
            >
              <List className="w-4 h-4" />
              {t("measurements.list_view", "List")}
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setViewMode("analytics")}
              className={`px-6 py-2 text-xs gap-2 transition-all rounded-lg font-bold ${
                viewMode === "analytics" ? "bg-white shadow-sm text-primary" : "text-slate-500"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t("measurements.analytics_view", "Analytics")}
            </Button>
          </div>
        </div>

        <main className="bg-white rounded-2xl border shadow-sm overflow-hidden min-h-[400px]">
          {viewMode === "list" ? (
            <div className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ResultsTable answers={displayAnswers} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-left">
              <AnalyticsView answers={displayAnswers} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AssessmentResultsPage;