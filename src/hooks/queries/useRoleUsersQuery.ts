import { useQuery } from "@tanstack/react-query";
import { getClinicManagers, getDoctors, getPatients } from "@/api/usersApi";
import type { UserRole } from "@/common/types/Role";
import type { IUser } from "@/common/Users";

const QUERY_FN_BY_ROLE: Partial<Record<UserRole, () => Promise<IUser[]>>> = {
  admin: getClinicManagers,
  clinic_manager: getDoctors,
  doctor: getPatients,
};

export const useRoleUsersQuery = (role: UserRole, enabled: boolean) => {
  const queryFn = QUERY_FN_BY_ROLE[role];
  return useQuery({
    queryKey: ["users", role],
    queryFn: queryFn ?? (() => Promise.resolve([])),
    enabled: enabled && !!queryFn,
  });
};
