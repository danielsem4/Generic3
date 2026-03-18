import { useFilteredUsers } from "@/hooks/common/useFilteredUsers";
import { getDoctors } from "@/api/usersApi";

export function useDoctors() {
  return useFilteredUsers(["users", "doctors"], getDoctors);
}
