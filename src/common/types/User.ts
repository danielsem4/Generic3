export interface IClinic {
  id: number;
  name: string;
}

export interface IAuthUser {
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
  clinics: IClinic[];
  modules?: IModule[];
}

/** Sanitized user data safe to persist in localStorage. */
export interface ISafeUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  clinicId: number | null;
  clinicName: string;
  clinicImage: string;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  isClinicManager: boolean;
  isResearchPatient: boolean;
  modules: IModule[];
}

export const USER_ROLES = {
  ADMIN: "ADMIN",
  CLINIC_MANAGER: "CLINIC_MANAGER",
  DOCTOR: "DOCTOR",
  PATIENT: "PATIENT",
} as const;

/** Strips sensitive fields and normalises the API response into a safe, persisted shape. */
export function sanitizeUser(user: IAuthUser): ISafeUser {
  const clinic = user.clinics?.[0] ?? null;
  return {
    id: user.id,
    username: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    clinicId: clinic?.id ?? null,
    clinicName: clinic?.name ?? "",
    clinicImage: "",
    isAdmin: user.role === USER_ROLES.ADMIN,
    isDoctor: user.role === USER_ROLES.DOCTOR,
    isPatient: user.role === USER_ROLES.PATIENT,
    isClinicManager: user.role === USER_ROLES.CLINIC_MANAGER,
    isResearchPatient: false,
    modules: user.modules ?? [],
  };
}

export interface IModule {
  id: number;
  name: string;
}
