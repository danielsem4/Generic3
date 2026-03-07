import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../api/dashboard.api";
import { useMe } from "@/features/auth/hooks/useMe";

export const useDashboard = () => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["dashboard", "users", user?.clinicId, user?.id],
    queryFn: () => getUsers(user!.clinicId, user!.id),
    enabled: !!user?.clinicId && !!user?.id,
  });
};

