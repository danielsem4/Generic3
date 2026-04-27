import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import { getPatientMeasurementSubmissions } from "@/api/patientMeasurementsApi";

export function usePatientMeasurementSubmissions() {
  const { userId, measurementId } = useParams<{
    userId: string;
    measurementId: string;
  }>();

  const {
    data: patientResponse,
    isLoading: isPatientLoading,
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
    error: submissionsError,
  } = useQuery({
    queryKey: ["patient-measurement-submissions", clinicId, userId],
    queryFn: () => getPatientMeasurementSubmissions(clinicId!, userId!),
    enabled: !!clinicId && !!userId,
  });

  const filteredSubmissions = submissions.filter(
    (item) => String(item.measurementId) === String(measurementId),
  );

  return {
    submissions: filteredSubmissions,
    isLoading: isPatientLoading || isSubmissionsLoading,
    error: patientError || submissionsError,
  };
}