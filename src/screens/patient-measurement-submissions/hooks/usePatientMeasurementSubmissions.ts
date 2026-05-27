import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import {
  getPatientMeasurementSubmissions,
  deletePatientMeasurementSubmission,
} from "@/api/patientMeasurementsApi";

export function usePatientMeasurementSubmissions() {
  const { userId, measurementId } = useParams<{
    userId: string;
    measurementId: string;
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
  "patient-measurement-submissions",
  clinicId,
  userId,
  measurementId,
],
    queryFn: () => getPatientMeasurementSubmissions(clinicId!, userId!),
    enabled: !!clinicId && !!userId,
  });

  const deleteMutation = useMutation({
    mutationFn: (submissionId: string) =>
      deletePatientMeasurementSubmission(clinicId!, userId!, submissionId),

    onSuccess: () => {
      queryClient.invalidateQueries({
  queryKey: [
    "patient-measurement-submissions",
    clinicId,
    userId,
    measurementId,
  ],
      });
    },
  });

  const filteredSubmissions = submissions.filter(
    (item) => String(item.measurementId) === String(measurementId),
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