import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/usersApi";

export const useUsersQuery = (clinicId: number | null, userId: string | null) => {
  return useQuery({
    queryKey: ["users", clinicId, userId],
    queryFn: () => {
      if (!clinicId || !userId) throw new Error("Missing clinicId or userId");
      return getUsers(clinicId, userId);
    },
    enabled: !!clinicId && !!userId,
  });
};
