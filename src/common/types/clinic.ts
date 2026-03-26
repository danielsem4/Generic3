export interface IClinicManager {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
}

export interface IClinicModule {
  id: string;
  clinic: string;
  module: string;
  module_name: string;
  module_description: string;
  is_active: boolean;
}

export interface IClinic {
  id: string;
  clinic_name: string;
  clinic_url: string;
  clinic_image_url: string | null;
  is_research_clinic: boolean;
  clinic_manager: IClinicManager;
  modules: IClinicModule[];
}
