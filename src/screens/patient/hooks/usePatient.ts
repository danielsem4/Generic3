import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPatientDetails } from "@/api/usersApi";
import type {
  IPatientDetails,
  IPatientSectionItem,
} from "@/common/types/patientDetails";

export function usePatientDetails() {
  const { userId } = useParams<{ userId: string }>();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["patient", userId],
    queryFn: () => getPatientDetails(userId!),
    enabled: !!userId,
  });

  const patient: IPatientDetails | null = response
    ? {
        patientId: response.patient_id,
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        phone: response.phone,
        isResearch: response.is_research,
        clinicName: response.clinic_name,
        modules: response.modules,
        activeMeasurements: response.active_measurements,
        // security: {
        //   is2FAEnabled: response.security.is_2fa_enabled,
        //   joinedAt: response.security.joined_at,
        // },
      }
    : null;

  const modules: IPatientSectionItem[] = (response?.modules ?? []).map(
    (module) => ({ id: module.id, label: module.module_name }),
  );

  const metrics: IPatientSectionItem[] = (
    response?.active_measurements ?? []
  ).map((measurementName, index) => ({
    id: index + 1,
    label: measurementName,
  }));

  const functions: IPatientSectionItem[] = [];

  console.log({ returnedModules: modules });

  return { patient, modules, metrics, functions, isLoading, error };
}
