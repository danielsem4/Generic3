// Define exactly as the professor's table
export interface IPatientMedicine {
  medicine: string;
  patient: string;
  clinic: string;
  doctor: string;
  frequency: "once" | "daily" | "weekly" | "monthly";
  frequency_data: string[];
  start_date: string;
  end_date: string;
  dosage: string;
  medName?: string;
  medForm?: string;
}

// Interface for the actual intake history (matches backend snake_case response)
export interface IIntakeLog {
  id: string;
  patient_medication: string;
  patient: string;
  med_name: string;
  taken_at: string;
  dosage_taken: string;
  status: string;
}

export interface IMedicationLogFilters {
  med_name?: string;
  start_date?: string;
}

export interface ISelectedMed {
  id: string;
  med_name: string;
  med_form: string;
  med_unit: string;
}

import type { IClinicMedication } from "@/common/types/Medication";

export interface IMedicationHookData {
  clinicMedications: IClinicMedication[];
  frequency: "once" | "daily" | "weekly" | "monthly";
  setFrequency: (f: "once" | "daily" | "weekly" | "monthly") => void;
  startDate: string;
  setStartDate: (d: string) => void;
  endDate: string;
  setEndDate: (d: string) => void;
  dosageAmount: string;
  setDosageAmount: (a: string) => void;
  dosageUnit: string;
  setDosageUnit: (u: string) => void;
  timeSlots: string[];
  addTimeSlot: () => void;
  removeTimeSlot: (index: number) => void;
  selectedMed: ISelectedMed | null;
  setSelectedMed: (med: ISelectedMed | null) => void;
  handleFinalize: (closeModal: () => void) => void;
  isAddPending: boolean;
  selectedDays: string[];
  selectedWeeks: string[];
  toggleDay: (day: string) => void;
  toggleWeek: (week: string) => void;
}
