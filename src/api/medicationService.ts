import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
} from "@/common/types/Medication";
import api from "@/lib/axios";

export async function fetchAllGlobalMedications(): Promise<IMedication[]> {
  const response = await api.get<IMedication[]>("/api/v1/medications/");
  console.log({ medications: response.data });

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
