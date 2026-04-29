import { useQuery } from "@tanstack/react-query";
import { getSingleSubmission } from "@/api/assesmentApi"; 
import { useParams } from "react-router-dom";

export function useAssessmentResults() {
  const { userId, submissionId } = useParams();

  const authData = JSON.parse(localStorage.getItem("auth-storage") || "{}");
  const clinicId = authData?.state?.user?.clinicId || authData?.state?.clinicId;

  return useQuery({
    queryKey: ["detailed-submission", submissionId],
    queryFn: () => getSingleSubmission(clinicId!, userId!, submissionId!),
    enabled: !!(clinicId && userId && submissionId),
    retry: false,
  });
}