import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/common/types/Role";

export function useRole(): UserRole {
  return useAuthStore((s) => s.role!);
}
