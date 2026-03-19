export interface IMedication {
  id: string;
  medName: string;
  medForm: string;
  medUnitOfMeasurement: string;
}

export interface IClinicMedication {
  id: string;
  clinicId: string;
  medicationId: string;
  medication: IMedication;
}

export type PrescriptionFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IPatientPrescription {
  id: string;
  patientId: string;
  clinicId: string;
  doctorId: string;
  medicationId: string;
  medName: string;
  startDate: string;
  endDate: string;
  dosage: string;
  frequency: PrescriptionFrequency;
}

// Pre-defined for future log-history feature — not rendered in this release
export type MedicationLogStatus = "TAKEN" | "SKIPPED" | "DELAYED";

export interface IPatientMedicationLog {
  id: string;
  patientMedicationId: string;
  patientId: string;
  takenAt: string;
  dosageTaken: string;
  status: MedicationLogStatus;
}

/**
 * Type guard: returns true when item is IMedication (catalog view).
 * Use "medForm" in item to detect IMedication vs IPatientPrescription.
 * Note: IClinicMedication is NOT part of this union — callers upstream
 * unwrap IClinicMedication.medication (IMedication) before calling this guard.
 */
export function isCatalogItem(
  item: IMedication | IPatientPrescription,
): item is IMedication {
  return "medForm" in item;
}
