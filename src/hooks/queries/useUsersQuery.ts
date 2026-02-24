import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/usersApi";

export const useUsersQuery = (clinicId: number | null, userId: number | null) => {
  return useQuery({
    queryKey: ["users", clinicId, userId],
    queryFn: () => getUsers(clinicId!, userId!),
    enabled: !!clinicId && !!userId,
  });
};
