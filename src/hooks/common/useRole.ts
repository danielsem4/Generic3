import { useAuthStore } from "@/store/useAuthStore";
import { deriveRole, type UserRole } from "@/common/types/Role";

export function useRole(): UserRole {
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const isClinicManager = useAuthStore((s) => s.isClinicManager);
  const isDoctor = useAuthStore((s) => s.isDoctor);
  const isPatient = useAuthStore((s) => s.isPatient);
  return deriveRole({ isAdmin, isClinicManager, isDoctor, isPatient });
}
