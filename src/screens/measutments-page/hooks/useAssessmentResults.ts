import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSingleSubmission } from "@/api/measurementsApi"; 
import type { IMeasurementSubmission } from "@/common/types/measurements";

export function useAssessmentResults(clinicId: string, userId: string, submissionId: string) {
  const [viewMode, setViewMode] = useState<"list" | "analytics">("list");

  const { data, isLoading, error } = useQuery<IMeasurementSubmission[]>({
    queryKey: ["measurement-submission", submissionId],
    queryFn: () => getSingleSubmission(clinicId, userId, submissionId),
    enabled: !!submissionId && !!clinicId,
  });

  // לוקחים את האיבר הראשון מהמערך שהשרת מחזיר. אם המערך ריק, זה יהיה undefined.
  const submission = data?.[0];

  const stats = {
    totalQuestions: submission?.answers?.length || 0,
    correctAnswers: submission?.answers?.filter(a => a.is_correct === true).length || 0,
    incorrectAnswers: submission?.answers?.filter(a => a.is_correct === false).length || 0,
    completionRate: submission?.answers?.length 
      ? Math.round((submission.answers.filter(a => a.value !== null).length / submission.answers.length) * 100) 
      : 0,
  };

  return {
    submission,
    isLoading,
    error,
    viewMode,
    setViewMode,
    stats
  };
}