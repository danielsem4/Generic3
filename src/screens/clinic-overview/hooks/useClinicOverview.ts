import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export const useClinicOverview = () => {
const { role, clinicId, userId } = useAuthStore();

  const clinicQuery = useQuery({
    queryKey: ["clinic-details", clinicId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/clinics/${clinicId}/`);
      return response.data;
    },
    enabled: !!clinicId,
  });

  const userQuery = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      const response = await api.get(`/api/v1/users/${userId}/`);
      return response.data;
    },
    enabled: !!userId,
  });

  const isManager = role === "ADMIN" || role === "CLINIC_MANAGER";

  return {
    clinic: clinicQuery.data,
    manager: clinicQuery.data?.manager || userQuery.data,
    isLoading: clinicQuery.isLoading || userQuery.isLoading,
    error: clinicQuery.error,
    isManager,
    clinicId
  };
};