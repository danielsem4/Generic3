import type {IPatientDetails,IPatientDetailsResponse,IPatientSectionItem} from "@/common/types/patientDetails";
import { patientDetailsMock } from "./patientMock";

export function usePatientDetails() {
  const response: IPatientDetailsResponse = patientDetailsMock;

  const patient: IPatientDetails = {
    patientId: response.patient_id,
    firstName: response.first_name,
    lastName: response.last_name,
    email: response.email,
    phone: response.phone,
    isResearch: response.is_research,
    clinicName: response.clinic_name,
    activeModules: response.active_modules,
    activeMeasurements: response.active_measurements,
    security: {
      is2FAEnabled: response.security.is_2fa_enabled,
      joinedAt: response.security.joined_at,
    },
  };

   const modules: IPatientSectionItem[] = response.active_modules.map((moduleName, index) => ({
    id: index + 1,
    label: moduleName,
  }));

  const metrics: IPatientSectionItem[] = response.active_measurements.map((measurementName, index) => ({
    id: index + 1,
    label: measurementName,
  }));

  const functions: IPatientSectionItem[] = [];
  return { patient, modules, metrics, functions };
}