import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { sanitizeUser } from "@/common/types/User";

export function useInitAuth() {
  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getCurrentUser();
      const activeClinicId = useAuthStore.getState().clinicId ?? undefined;
      useAuthStore.getState().setAuthUser(sanitizeUser(res.data, activeClinicId));
      return res.data;
    },
    retry: false,
  });

  return { isLoading };
}
