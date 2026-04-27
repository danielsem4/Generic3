import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import { fetchMeasurements } from "@/api/measurementsApi";
import type { IPatientDetails } from "@/common/types/patientDetails";
import type { ISectionItem } from "@/common/types/section";

export function useMeasurementPage() {
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
    data: measurements = [],
    isLoading: isMeasurementsLoading,
    error: measurementsError,
  } = useQuery({
    queryKey: ["measurements", clinicId],
    queryFn: () => fetchMeasurements(clinicId!),
    enabled: !!clinicId,
  });

  const patient: IPatientDetails | null = patientResponse
    ? {
        patientId: patientResponse.patient_id,
        firstName: patientResponse.first_name,
        lastName: patientResponse.last_name,
        email: patientResponse.email,
        phone: patientResponse.phone,
        isResearch: patientResponse.is_research,
        clinicName: patientResponse.clinic_name,
      }
    : null;

  const questionnaires: ISectionItem[] = measurements
    .filter((measurement) => measurement.type === "QUESTIONNAIRES")
    .map((measurement) => ({
      id: measurement.id,
      label: measurement.name,
    }));

  const cognitiveTests: ISectionItem[] = measurements
    .filter((measurement) => measurement.type === "COGNITIVE_TESTS")
    .map((measurement) => ({
      id: measurement.id,
      label: measurement.name,
    }));

  const moduleQuestionnaires: ISectionItem[] = measurements
    .filter((measurement) => measurement.type === "MODULE_QUESTIONNAIRE")
    .map((measurement) => ({
      id: measurement.id,
      label: measurement.name,
    }));

  return {
    patient,
    questionnaires,
    cognitiveTests,
    moduleQuestionnaires,
    isLoading: isPatientLoading || isMeasurementsLoading,
    error: patientError || measurementsError,
  };
}