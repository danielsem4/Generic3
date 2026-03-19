export interface IPatientDetailsResponse {
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_research: boolean;
  clinic_name: string;
  active_modules: string[];
  active_measurements: string[];
  security: {
    is_2fa_enabled: boolean;
    joined_at: string;
  };
}

export interface IPatientDetails {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isResearch: boolean;
  clinicName: string;
  activeModules: string[];
  activeMeasurements: string[];
  security: {
    is2FAEnabled: boolean;
    joinedAt: string;
  };
}

export interface IPatientSectionItem {
  id: number;
  label: string;
}