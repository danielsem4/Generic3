import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPatientDetails } from "@/api/usersApi";
import {
  getSingleSubmission,
  deleteEvaluationAnswer,
  updateEvaluationAnswerScore,
} from "@/api/patientEvaluationApi";

export function useAssessmentResults() {
  const { userId, submissionId } = useParams<{
    userId: string;
    submissionId: string;
  }>();

  const queryClient = useQueryClient();

  const patientQuery = useQuery({
    queryKey: ["patient", userId],
    queryFn: () => getPatientDetails(userId!),
    enabled: Boolean(userId),
  });

  const clinicId = patientQuery.data?.clinics?.[0]?.id;

  const submissionQuery = useQuery({
    queryKey: ["patient-evaluation-submission", clinicId, userId, submissionId],
    queryFn: () => getSingleSubmission(clinicId!, userId!, submissionId!),
    enabled: Boolean(clinicId && userId && submissionId),
    retry: false,
  });

  const editScoreMutation = useMutation({
    mutationFn: ({ answerId, score }: { answerId: string; score: number }) =>
      updateEvaluationAnswerScore(
        clinicId!,
        userId!,
        submissionId!,
        answerId,
        score,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "patient-evaluation-submission",
          clinicId,
          userId,
          submissionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-evaluation-submissions", clinicId, userId],
      });
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (answerId: string) =>
      deleteEvaluationAnswer(clinicId!, userId!, submissionId!, answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "patient-evaluation-submission",
          clinicId,
          userId,
          submissionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["patient-evaluation-submissions", clinicId, userId],
      });
    },
  });

  const handleEditScore = (answerId: string, score: number) => {
    editScoreMutation.mutate({ answerId, score });
  };

  const handleDeleteAnswer = (answerId: string) => {
    deleteAnswerMutation.mutate(answerId);
  };

  return {
    data: submissionQuery.data,
    isLoading: patientQuery.isLoading || submissionQuery.isLoading,
    error: patientQuery.error || submissionQuery.error,
    onEditScore: handleEditScore,
    isEditingScore: editScoreMutation.isPending,
    onDeleteAnswer: handleDeleteAnswer,
    isDeletingAnswer: deleteAnswerMutation.isPending,
  };
}
