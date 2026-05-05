import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getPatientDetails } from "@/api/usersApi";
import {
  getPatientMeasurementSubmissions,
  updateMeasurementAnswerScore,
} from "@/api/patientMeasurementsApi";

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
    queryKey: ["patient-measurement-submission", clinicId, userId, submissionId],
    queryFn: async () => {
      const submissions = await getPatientMeasurementSubmissions(
        clinicId!,
        userId!,
      );

      return submissions.find((item) => item.id === submissionId) ?? null;
    },
    enabled: Boolean(clinicId && userId && submissionId),
    retry: false,
  });

  const editScoreMutation = useMutation({
    mutationFn: ({ answerId, score }: { answerId: string; score: number }) =>
      updateMeasurementAnswerScore(
        clinicId!,
        userId!,
        submissionId!,
        answerId,
        score,
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-measurement-submission", clinicId, userId, submissionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-measurement-submissions", clinicId, userId],
      });
    },
  });

  return {
    data: submissionQuery.data,
    isLoading: patientQuery.isLoading || submissionQuery.isLoading,
    error: patientQuery.error || submissionQuery.error,
    onEditScore: (answerId: string, score: number) =>
      editScoreMutation.mutate({ answerId, score }),
    isEditingScore: editScoreMutation.isPending,
  };
}