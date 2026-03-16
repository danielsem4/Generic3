export type UserRole =
  | "admin"
  | "clinic_manager"
  | "doctor"
  | "patient"
  | "unknown";

export function deriveRole(flags: {
  isAdmin: boolean;
  isClinicManager: boolean;
  isDoctor: boolean;
  isPatient: boolean;
}): UserRole {
  if (flags.isAdmin) return "admin";
  if (flags.isClinicManager) return "clinic_manager";
  if (flags.isDoctor) return "doctor";
  if (flags.isPatient) return "patient";
  return "unknown";
}

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  admin: "/clinic-managers",
  clinic_manager: "/doctors",
  doctor: "/patients",
  patient: "/home",
  unknown: "/home",
};
