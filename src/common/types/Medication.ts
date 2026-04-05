export interface IMedication {
  id: string;
  med_name: string;
  med_form: string;
  med_unit: string;
}

export interface IClinicMedication {
  id: string;
  clinic: string;
  medication: string;
  med_name: string;
  med_form: string;
  med_unit: string;
}

export type PrescriptionFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

export interface IPatientPrescription {
  id: string;
  patient: string;
  clinic: string;
  doctor: string;
  medication: string;

  med_name: string;
  med_form: string;
  med_unit: string;

  start_date: string;
  end_date: string;

  dosage: string;
  frequency: PrescriptionFrequency;
  frequency_data: {
    time_slots?: string[]; // for DAILY frequency
    times_per_day?: number; // for DAILY frequency
  };
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
 * Type guard: returns true when item is IPatientPrescription (prescription view).
 * Check for presence of "dosage" — only IPatientPrescription has it.
 * Note: IClinicMedication is NOT part of this union — callers upstream
 * unwrap IClinicMedication.medication (IMedication) before calling this guard.
 */
export function isPrescription(
  item: IMedication | IPatientPrescription,
): item is IPatientPrescription {
  return "dosage" in item;
}
