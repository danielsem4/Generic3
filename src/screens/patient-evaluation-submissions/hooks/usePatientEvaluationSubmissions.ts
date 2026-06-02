import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import {
  getPatientEvaluationSubmissions,
  deletePatientEvaluationSubmission,
} from "@/api/patientEvaluationApi";

export function usePatientEvaluationSubmissions() {
  const { userId, evaluationId } = useParams<{
    userId: string;
    evaluationId: string;
  }>();

  const queryClient = useQueryClient();

  const {
  data: patientResponse,
  isLoading: isPatientLoading,
  isFetching: isPatientFetching,
  error: patientError,
} = useQuery({
  queryKey: ["patient", userId],
  queryFn: () => getPatientDetails(userId!),
  enabled: !!userId,
});

  const clinicId = patientResponse?.clinics?.[0]?.id;

  const {
    data: submissions = [],
    isLoading: isSubmissionsLoading,
    isFetching: isSubmissionsFetching,
    error: submissionsError,
  } = useQuery({
    queryKey: [
  "patient-evaluation-submissions",
  clinicId,
  userId,
  evaluationId,
],
    queryFn: () => getPatientEvaluationSubmissions(clinicId!, userId!),
    enabled: !!clinicId && !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (submissionId: string) =>
      deletePatientEvaluationSubmission(clinicId!, userId!, submissionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
  queryKey: [
    "patient-evaluation-submissions",
    clinicId,
    userId,
    evaluationId,
  ],
      });
    },
  });

  const filteredSubmissions = submissions.filter(
    (item) => String(item.evaluationId) === String(evaluationId),
  );

  return {
    submissions: filteredSubmissions,
    isLoading: isPatientLoading || isSubmissionsLoading,
    isFetching: isPatientFetching || isSubmissionsFetching,
    error: patientError || submissionsError,
    onDelete: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
  };
}