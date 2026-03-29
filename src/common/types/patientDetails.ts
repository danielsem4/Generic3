export interface IModule {
  id: number;
  module_name: string;
  description?: string;
}

export interface IPatientDetailsResponse {
  patient_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_research: boolean;
  clinic_name: string;
  modules: IModule[];
  active_measurements: string[];
  // security: {
  //   is_2fa_enabled: boolean;
  //   joined_at: string;
  // };
}

export interface IPatientDetails {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isResearch: boolean;
  clinicName: string;
  modules: string[];
  activeMeasurements: string[];
  // security: {
  //   is2FAEnabled: boolean;
  //   joinedAt: string;
  // };
}

export interface IPatientSectionItem {
  id: number;
  label: string;
}

export type IModuleRouteMapper = Record<string, () => void>;
