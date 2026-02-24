export interface IAuthUser {
  id: string;
  password: string;
  lastLogin: string | null;
  isSuperuser: boolean;
  username: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isClinicManager: boolean;
  isDoctor: boolean;
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

/** Sanitized user data safe to persist in localStorage. */
export interface ISafeUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  clinicId: number;
  clinicName: string;
  clinicImage: string;
  isDoctor: boolean;
  isPatient: boolean;
  isClinicManager: boolean;
  isResearchPatient: boolean;
  modules: IModule[];
}

/** Strips sensitive fields (password, PII, permissions, server info) from the API response. */
export function sanitizeUser(user: IAuthUser): ISafeUser {
  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    clinicId: user.clinicId,
    clinicName: user.clinicName,
    clinicImage: user.clinicImage,
    isDoctor: user.isDoctor,
    isPatient: user.isPatient,
    isClinicManager: user.isClinicManager,
    isResearchPatient: user.isResearchPatient,
    modules: user.modules,
  };
}

export interface IModule {
  id: number;
  name: string;
}
