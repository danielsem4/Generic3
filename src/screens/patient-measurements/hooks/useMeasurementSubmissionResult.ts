import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useMeasurementSubmissionQuery } from "./useMeasurementSubmissionQuery";

export function useMeasurementSubmissionResult() {
  const { userId = "", submissionId = "" } = useParams<{
    userId: string;
    submissionId: string;
  }>();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data: submission, isLoading, isError } = useMeasurementSubmissionQuery(
    clinicId,
    userId,
    submissionId,
  );

  const isCognitiveTest =
    submission?.answers.some((a) => a.element.element_type === "COGNITIVE_FIELD") ?? false;

  return { submission, isCognitiveTest, isLoading, isError };
}
