import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
} from "@/common/types/Medication";

// ─── Mock data ───────────────────────────────────────────────────────────────

const GLOBAL_MEDICATIONS: IMedication[] = [
  { id: "1", medName: "ASPIRIN TAB 500MG", medForm: "TAB", medUnitOfMeasurement: "MG" },
  { id: "2", medName: "ADVIL FORTE LIQUI-GELS CAP 400mg", medForm: "CAP", medUnitOfMeasurement: "MG" },
  { id: "3", medName: "AGRIPPAL S1 VAC 10X0.5mL", medForm: "VAC", medUnitOfMeasurement: "ML" },
  { id: "4", medName: "LEVODOPA-CARBIDOPA TAB 50mg/200mg", medForm: "TAB", medUnitOfMeasurement: "MG" },
  { id: "5", medName: "METHYLDOPA 250MG TAB", medForm: "TAB", medUnitOfMeasurement: "MG" },
  { id: "6", medName: "SINEMET ORAL SUS 5mg/ml", medForm: "SUS", medUnitOfMeasurement: "ML" },
];

const CLINIC_MEDICATIONS: IClinicMedication[] = [
  { id: "cm1", clinicId: "clinic1", medicationId: "1", medication: GLOBAL_MEDICATIONS[0] },
  { id: "cm2", clinicId: "clinic1", medicationId: "3", medication: GLOBAL_MEDICATIONS[2] },
  { id: "cm3", clinicId: "clinic1", medicationId: "4", medication: GLOBAL_MEDICATIONS[3] },
];

const PATIENT_PRESCRIPTIONS: IPatientPrescription[] = [
  {
    id: "rx1", patientId: "patient1", clinicId: "clinic1", doctorId: "doc1",
    medicationId: "1", medName: "ASPIRIN TAB 500MG",
    startDate: "2025-01-01", endDate: "2025-04-01", dosage: "500mg", frequency: "DAILY",
  },
  {
    id: "rx2", patientId: "patient1", clinicId: "clinic1", doctorId: "doc1",
    medicationId: "4", medName: "LEVODOPA-CARBIDOPA TAB",
    startDate: "2025-02-01", endDate: "2025-08-01", dosage: "200mg", frequency: "WEEKLY",
  },
];

// ─── API functions ────────────────────────────────────────────────────────────

export async function fetchAllGlobalMedications(): Promise<IMedication[]> {
  return Promise.resolve(GLOBAL_MEDICATIONS);
}

export async function fetchClinicMedications(
  _clinicId: string,
): Promise<IClinicMedication[]> {
  return Promise.resolve(CLINIC_MEDICATIONS);
}

export async function fetchPatientPrescriptions(
  _patientId: string,
): Promise<IPatientPrescription[]> {
  return Promise.resolve(PATIENT_PRESCRIPTIONS);
}

export async function addGlobalMedication(data: {
  medName: string;
  medForm: string;
  medUnit: string;
}): Promise<IMedication> {
  const newMed: IMedication = {
    id: String(Date.now()),
    medName: data.medName,
    medForm: data.medForm,
    medUnitOfMeasurement: data.medUnit,
  };
  return Promise.resolve(newMed);
}

export async function addMedicationToClinic(
  clinicId: string,
  medicationId: string,
): Promise<IClinicMedication> {
  const med = GLOBAL_MEDICATIONS.find((m) => m.id === medicationId);
  if (!med) throw new Error("Medication not found");
  return Promise.resolve({
    id: String(Date.now()),
    clinicId,
    medicationId,
    medication: med,
  });
}

export async function removeMedicationFromClinic(
  _clinicId: string,
  _medicationId: string,
): Promise<void> {
  return Promise.resolve();
}
