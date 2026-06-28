// Define exactly as the professor's table
export type FrequencyType = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY"; 


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

  frequency: FrequencyType;
  setFrequency: (f: FrequencyType) => void;

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
  updateTimeSlot: (index: number, value: string) => void;

  selectedDays: string[];
  toggleDay: (day: string) => void;

  dayOfMonth: string;
  setDayOfMonth: (value: string) => void;

  selectedMed: ISelectedMed | null;
  setSelectedMed: (med: ISelectedMed | null) => void;

  handleFinalize: (closeModal: () => void) => void;
  isAddPending: boolean;
}