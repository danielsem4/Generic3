export interface IClinic {
  id: string;
  name: string;
  is_research: boolean;
  clinic_url: string;
  clinic_image_url: string;
  created_at: string;
}

export interface IClinicModule {
  id: string;
  module_id: string;
  is_active: boolean;
  clinic_id: string;
  label?: string; 
}

export interface IClinicManager {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}