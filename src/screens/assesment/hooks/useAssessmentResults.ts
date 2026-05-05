import { useQuery } from "@tanstack/react-query";
import { getSingleSubmission } from "@/api/assesmentApi";
import { useParams } from "react-router-dom";

export function useAssessmentResults() {
  const { userId, submissionId } = useParams();
  const authData = JSON.parse(localStorage.getItem("auth-storage") || "{}");
  const clinicId = authData?.state?.user?.clinicId || authData?.state?.clinicId;

  const { data, isLoading, error } = useQuery({
    queryKey: ["unique-assessment", submissionId], 
    queryFn: () => getSingleSubmission(clinicId!, userId!, submissionId!),
    enabled: !!(clinicId && userId && submissionId),
  });

  const stats = {
    score: data?.score ?? 0,
    maxScore: data?.max_score ?? 0,
    frequency: data?.frequency ?? "Once"
  };

  return { 
    submission: data, 
    stats, 
    isLoading, 
    error 
  };
}