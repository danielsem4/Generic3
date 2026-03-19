import { useFilteredUsers } from "@/hooks/common/useFilteredUsers";
import { getPatients } from "@/api/usersApi";

export function usePatients() {
  return useFilteredUsers(["users", "patients"], getPatients);
}
