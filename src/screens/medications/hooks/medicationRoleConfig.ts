import type { UserRole } from "@/common/types/Role";
import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
} from "@/common/types/Medication";
import {
  fetchAllGlobalMedications,
  fetchClinicMedications,
  fetchPatientMedications,
} from "@/api/medicationService";
import { useAuthStore } from "@/store/useAuthStore";

export type SortOption = "az" | "za" | "form";
export type ViewMode = "catalog" | "prescription";

export type MedicationItem =
  | IMedication
  | IClinicMedication
  | IPatientPrescription;

export interface RoleConfig {
  queryFn: () => Promise<MedicationItem[]>;
  viewMode: ViewMode;
  sortOptions: SortOption[];
}

/**
 * Returns a RoleConfig for the given role.
 * Must be called inside a React hook (reads Zustand store via getState snapshot).
 * Note: IDs are captured at call time — acceptable for mock phase.
 */
export function buildRoleConfig(role: UserRole): RoleConfig {
  const clinicId = useAuthStore.getState().clinicId ?? "";
  const userId = useAuthStore.getState().userId ?? "";

  const configs: Record<UserRole, RoleConfig> = {
    ADMIN: {
      queryFn: fetchAllGlobalMedications,
      viewMode: "catalog",
      sortOptions: ["az", "za", "form"],
    },
    CLINIC_MANAGER: {
      queryFn: () => fetchClinicMedications(clinicId),
      viewMode: "catalog",
      sortOptions: ["az", "za", "form"],
    },
    DOCTOR: {
      queryFn: () => fetchClinicMedications(clinicId),
      viewMode: "catalog",
      sortOptions: ["az", "za", "form"],
    },
    PATIENT: {
      queryFn: () => fetchPatientMedications(clinicId, userId),
      viewMode: "prescription",
      sortOptions: ["az", "za"],
    },
    RESEARCH_PATIENT: {
      queryFn: () => fetchClinicMedications(clinicId),
      viewMode: "catalog",
      sortOptions: ["az", "za", "form"],
    },
  };

  return configs[role];
}

export const SORT_LABEL_KEYS: Record<SortOption, string> = {
  az: "medications.sortAZ",
  za: "medications.sortZA",
  form: "medications.sortForm",
};
