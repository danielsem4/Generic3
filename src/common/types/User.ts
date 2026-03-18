import type { UserRole } from "@/common/types/Role";

export interface IClinic {
  id: string;
  clinic_name: string;
  clinic_url: string;
  clinic_image_url: string | null;
  is_research_clinic: boolean;
}

export interface IAuthUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: string;
  is_active: boolean;
  is_2fa_enabled: boolean;
  created_at: string;
  clinics: IClinic[];
  modules?: IModule[];
}

export interface IModule {
  id: number;
  name: string;
}

export interface ISafeUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clinicId: string | null;
  clinicName: string;
  clinicImage: string | null;
  clinics: IClinic[];
  modules: IModule[];
}

export function sanitizeUser(user: IAuthUser, activeClinicId?: string): ISafeUser {
  const clinic =
    (activeClinicId ? user.clinics?.find((c) => c.id === activeClinicId) : null) ??
    user.clinics?.[0] ??
    null;
  const role = user.role as UserRole;
  return {
    id: user.id,
    username: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role,
    clinicId: clinic?.id ?? null,
    clinicName: clinic?.clinic_name ?? "",
    clinicImage: clinic?.clinic_image_url ?? null,
    clinics: user.clinics ?? [],
    modules: user.modules ?? [],
  };
}
