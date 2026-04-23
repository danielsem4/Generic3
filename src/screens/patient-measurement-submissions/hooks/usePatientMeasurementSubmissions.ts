import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import { getPatientMeasurementSubmissions } from "@/api/patientMeasurementsApi";

export function usePatientMeasurementSubmissions() {
  const { userId } = useParams<{ userId: string }>();

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

  return {
    submissions,
    isLoading: isPatientLoading || isSubmissionsLoading,
    error: patientError || submissionsError,
  };
}