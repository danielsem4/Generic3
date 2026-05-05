import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IMeasurementSubmissionAnswerRaw } from "@/common/types/patientMeasurementSubmission";
import { useAssessmentResults } from "./hooks/useAssessmentResults";
import { ResultsTable } from "./components/ResultsTable";
import { AnalyticsView } from "./components/AnalyticsView";

export const AssessmentResultsPage = () => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"list" | "analytics">("list");

  const {
    data: submission,
    isLoading,
    error,
    onEditScore,
  } = useAssessmentResults();

  useEffect(() => {
    if (submission) console.log("✅ Submission loaded:", submission);
    if (error) console.error("❌ API Error:", error);
  }, [submission, error]);

  if (isLoading) {
    return (
      <div className="p-20 text-center font-bold text-muted-foreground">
        {t("common.loading", "Loading Data...")}
      </div>
    );
  }

  // תיקון: בדיקה אם submission קיים ואם יש לו id
  if (error || !submission || !submission.id) {
    return (
      <div className="p-20 text-center text-destructive bg-destructive/10 rounded-xl border border-destructive/20 m-6">
        <h2 className="text-xl font-bold mb-2">
          {t("measurements.error_title", "Error: Submission not found")}
        </h2>
        <p className="text-sm">
          {t("measurements.error_desc", "Please check if the IDs are valid.")}
        </p>
      </div>
    );
  }

  const displayAnswers: IMeasurementSubmissionAnswerRaw[] =
    submission.answers ?? [];

  return (
    <div className="bg-background" dir={t("direction", "ltr")}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="text-left">
            <h1 className="text-2xl font-black text-foreground">
              {submission.measurementName}
            </h1>

            <div className="flex items-center gap-3 mt-2">
              <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {submission.frequency}
              </span>

              <p className="text-muted-foreground text-xs font-medium">
                {t("measurements.submitted_at", "Submitted at")}:{" "}
                {submission.submissionDate !== "-"
                  ? new Date(submission.submissionDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>

          <div className="bg-primary text-primary-foreground px-6 py-3 rounded-xl flex items-baseline gap-2 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-tighter opacity-80">
              {t("measurements.score", "Score")}:
            </span>
            <span className="text-2xl font-black">{submission.grade}</span>
            <span className="font-bold opacity-70">
              / {submission.maxScore}
            </span>
          </div>

          <div className="flex bg-muted p-1 rounded-xl">
            <Button
              variant="ghost"
              onClick={() => setViewMode("list")}
              className={`px-6 py-2 text-xs gap-2 transition-all rounded-lg font-bold ${
                viewMode === "list"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <List className="w-4 h-4" />
              {t("measurements.list_view", "List")}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setViewMode("analytics")}
              className={`px-6 py-2 text-xs gap-2 transition-all rounded-lg font-bold ${
                viewMode === "analytics"
                  ? "bg-background shadow-sm text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t("measurements.analytics_view", "Analytics")}
            </Button>
          </div>
        </div>

        <main className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {viewMode === "list" ? (
            <div className="p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ResultsTable
                answers={displayAnswers}
                onDelete={() => {}}
                onEditScore={onEditScore}
              />
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