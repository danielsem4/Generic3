import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAssessmentResults } from "./hooks/useAssessmentResults";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List } from "lucide-react";
import { AnalyticsView } from "./components/AnalyticsView";
import { Skeleton } from "@/components/ui/skeleton"; 
import type { IMeasurementAnswer } from "@/common/types/measurements";
import { ResultsTable } from "../measutments-page/components/ResultsTable";

const MOCK_ANSWERS: IMeasurementAnswer[] = [
  { 
    id: "1",  
    points_earned: 100, 
    is_correct: true,
    label: "Have you felt tense in the last two days?",
    value: "Yes, very much",
    element_type: "radio"
  } as IMeasurementAnswer,
  { 
    id: "2", 
    label: "Have you experienced difficulty sleeping?", 
    value: "Sometimes", 
    points_earned: 70, 
    is_correct: true,
    element_type: "radio"
  } as IMeasurementAnswer,
  { 
    id: "3", 
    label: "Did you feel an accelerated heart rate?", 
    value: "No", 
    points_earned: 100, 
    is_correct: true,
    element_type: "radio"
  } as IMeasurementAnswer,
  { 
    id: "4", 
    label: "Difficulty concentrating during the day?", 
    value: "Yes", 
    points_earned: 40, 
    is_correct: false,
    element_type: "radio"
  } as IMeasurementAnswer,
  { 
    id: "5", 
    label: "Sudden feelings of fear or panic?", 
    value: "Not at all", 
    points_earned: 100, 
    is_correct: true,
    element_type: "radio"
  } as IMeasurementAnswer
];

export default function AssessmentResultsPage() {
  const { t } = useTranslation();
  const { clinicId, userId, submissionId } = useParams<{ clinicId: string; userId: string; submissionId: string }>();
  
const { 
  submission, 
  isLoading, 
  viewMode,    
  setViewMode,
} = useAssessmentResults(clinicId || "", userId || "", submissionId || "");
  if (isLoading) {

    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }
  const displayAnswers = submission?.answers || MOCK_ANSWERS;


return (
    <div className="min-h-screen bg-background p-8 font-sans" dir="ltr">
      <div className="max-w-6xl mx-auto bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        
        <div className="p-8 border-b border-border flex flex-row justify-between items-center bg-card">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl font-bold text-foreground">
              {t("measurements.page_title")}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              {t("measurements.page_subtitle")}
            </p>
          </div>

          <div className="flex bg-muted p-1 rounded-xl border border-border">
            <Button 
              variant="ghost" 
              onClick={() => setViewMode("list")}
              className={`px-5 py-2 text-sm gap-2 transition-all rounded-lg font-semibold ${
                viewMode === "list" 
                  ? "bg-card shadow-sm text-primary hover:bg-card" 
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              }`}
            >
              <List className="w-4 h-4" />
              {t("measurements.list_view")}
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setViewMode("analytics")}
              className={`px-5 py-2 text-sm gap-2 transition-all rounded-lg font-semibold ${
                viewMode === "analytics" 
                  ? "bg-card shadow-sm text-primary hover:bg-card" 
                  : "text-muted-foreground hover:text-foreground hover:bg-transparent"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              {t("measurements.analytics_view")}
            </Button>
          </div>
        </div>

        <main className="bg-card">

          <pre className="text-[10px] font-mono overflow-auto bg-muted/20 p-2 rounded-md border border-border text-muted-foreground">
    {JSON.stringify(submission, null, 2)}
  </pre>
  
          {viewMode === "list" ? (
            <div className="p-4">
              <ResultsTable answers={displayAnswers} />
            </div>
          ) : (
            <AnalyticsView answers={displayAnswers} /> 
          )}
        </main>
      </div>
    </div>
  );
}