export interface IAuthUser {
  id: number;
  password: string;
  last_login: string | null;
  isSuperuser: boolean;
  username: string;
  isStaff: boolean;
  date_joined: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  is_active: boolean;
  isClinicManager: boolean;
  DOCTOR: boolean;
  isPatient: boolean;
  isResearchPatient: boolean;
  groups: [];
  userPermissions: [];
  clinicId: number;
  clinicName: string;
  clinicImage: string;
  modules: IModule[];
  status: string;
  serverUrl: string;
}

export interface IModule {
  id: number;
  name: string;
}
