import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import { fetchEvaluations } from "@/api/evaluationApi";
import type { IPatientDetails } from "@/common/types/patientDetails";
import type { ISectionItem } from "@/common/types/section";

export function useEvaluationPage() {
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
    data: evaluations = [],
    isLoading: isEvaluationsLoading,
    error: evaluationsError,
  } = useQuery({
    queryKey: ["evaluations", clinicId],
    queryFn: () => fetchEvaluations(clinicId!),
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

  const questionnaires: ISectionItem[] = evaluations
    .filter((evaluation) => evaluation.type === "QUESTIONNAIRES")
    .map((evaluation) => ({
      id: evaluation.id,
      label: evaluation.name,
    }));

  const cognitiveTests: ISectionItem[] = evaluations
    .filter((evaluation) => evaluation.type === "COGNITIVE_TESTS")
    .map((evaluation) => ({
      id: evaluation.id,
      label: evaluation.name,
    }));

  const moduleQuestionnaires: ISectionItem[] = evaluations
    .filter((evaluation) => evaluation.type === "MODULE_QUESTIONNAIRE")
    .map((evaluation) => ({
      id: evaluation.id,
      label: evaluation.name,
    }));

  return {
    patient,
    questionnaires,
    cognitiveTests,
    moduleQuestionnaires,
    isLoading: isPatientLoading || isEvaluationsLoading,
    error: patientError || evaluationsError,
  };
}