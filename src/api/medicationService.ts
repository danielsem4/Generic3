import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
  PrescriptionFrequency,
} from "@/common/types/Medication";

export interface IAddPatientMedicationPayload {
  medication_id: string;
  doctor_user_id: string;
  start_date: string;
  end_date: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  frequency_data: {
    time_slots?: string[];
    times_per_day?: number;
    days_of_week?: string[];
    weeks_of_month?: string[];
  };
}

export interface IUpdatePrescriptionPayload {
  dosage: string;
  start_date: string;
  end_date: string;
  frequency: PrescriptionFrequency;
}
import type {
  IIntakeLog,
  IMedicationLogFilters,
} from "@/screens/patient-meds/schema/patientMedicationsSchema";
import api from "@/lib/axios";

export async function fetchAllGlobalMedications(): Promise<IMedication[]> {
  const response = await api.get<IMedication[]>("/api/v1/medications/");
  return response.data;
}

export async function fetchClinicMedications(
  clinicId: string,
): Promise<IClinicMedication[]> {
  const response = await api.get<IClinicMedication[]>(
    `/api/v1/clinics/${clinicId}/medications/`,
  );
  return response.data;
}

export async function fetchPatientMedications(
  clinicId: string,
  patientId: string,
): Promise<IPatientPrescription[]> {
  const response = await api.get<IPatientPrescription[]>(
    `/api/v1/clinics/${clinicId}/patients/${patientId}/medications/`,
  );
  return response.data;
}

export async function fetchPatientMedicationLogs(
  clinicId: string,
  patientId: string,
  filters?: IMedicationLogFilters,
): Promise<IIntakeLog[]> {
  const response = await api.get<IIntakeLog[]>(
    `/api/v1/clinics/${clinicId}/patients/${patientId}/medication-logs/`,
    { params: filters },
  );
  return response.data;
}

export async function addPatientMedication(
  clinicId: string,
  userId: string,
  data: IAddPatientMedicationPayload,
): Promise<IPatientPrescription> {
  const response = await api.post<IPatientPrescription>(
    `/api/v1/clinics/${clinicId}/patients/${userId}/medications/`,
    data,
  );
  return response.data;
}

export async function deletePatientMedication(
  clinicId: string,
  userId: string,
  prescriptionId: string,
): Promise<void> {
  await api.delete(
    `/api/v1/clinics/${clinicId}/patients/${userId}/medications/${prescriptionId}/`,
  );
}

export async function updatePatientMedication(
  clinicId: string,
  patientId: string,
  prescriptionId: string,
  data: IUpdatePrescriptionPayload,
): Promise<IPatientPrescription> {
  const response = await api.patch<IPatientPrescription>(
    `/api/v1/clinics/${clinicId}/patients/${patientId}/medications/${prescriptionId}/`,
    data,
  );
  return response.data;
}

export async function addGlobalMedication(data: {
  med_name: string;
  med_form: string;
  med_unit: string;
}): Promise<IMedication> {
  const response = await api.post<IMedication>("/api/v1/medications/", data);
  return response.data;
}

export async function addMedicationToClinic(
  clinicId: string,
  medicationId: string,
): Promise<IClinicMedication> {
  const response = await api.post<IClinicMedication>(
    `/api/v1/clinics/${clinicId}/medications/`,
    { medication_id: medicationId },
  );
  return response.data;
}

export async function removeMedicationFromClinic(
  clinicId: string,
  medicationId: string,
): Promise<void> {
  await api.delete(`/api/v1/clinics/${clinicId}/medications/${medicationId}/`);
}

export async function removeGlobalMedication(
  medicationId: string,
): Promise<void> {
  await api.delete(`/api/v1/medications/${medicationId}/`);
}
