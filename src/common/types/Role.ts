export type UserRole =
  | "ADMIN"
  | "CLINIC_MANAGER"
  | "DOCTOR"
  | "PATIENT"
  | "RESEARCH_PATIENT";

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  ADMIN: "/clinic-managers",
  CLINIC_MANAGER: "/doctors",
  DOCTOR: "/patients",
  PATIENT: "/home",
  RESEARCH_PATIENT: "/home",
};
