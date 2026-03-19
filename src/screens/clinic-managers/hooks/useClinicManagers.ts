import { useFilteredUsers } from "@/hooks/common/useFilteredUsers";
import { getClinicManagers } from "@/api/usersApi";

export function useClinicManagers() {
  return useFilteredUsers(["users", "clinic-managers"], getClinicManagers);
}
