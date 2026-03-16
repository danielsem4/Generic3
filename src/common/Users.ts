export interface IUserClinic {
  id: string;
  clinic_name: string;
  clinic_url: string;
  clinic_image_url: string | null;
  is_research_clinic: boolean;
}

export interface IUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  is_staff: boolean;
  is_2fa_enabled: boolean;
  created_at: string;
  clinics: IUserClinic[];
}

export interface IPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface IUserModule {
  name: string;
  id: number;
  description: string;
  active: boolean;
}
