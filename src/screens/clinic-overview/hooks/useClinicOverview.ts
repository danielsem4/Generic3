import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { getClinicDetails } from "@/api/clinicsApi";

export const useClinicOverview = () => {
  const { role, clinicId: authClinicId } = useAuthStore();
  const location = useLocation();

  const effectiveClinicId: string | null =
    (location.state as { clinicId?: string } | null)?.clinicId ?? authClinicId;

  const { data: clinic, isLoading, error } = useQuery({
    queryKey: ["clinic-details", effectiveClinicId],
    queryFn: () => getClinicDetails(effectiveClinicId!),
    enabled: !!effectiveClinicId,
  });

  const isManager = role === "ADMIN" || role === "CLINIC_MANAGER";

  return {
    clinic,
    isLoading,
    error,
    isManager,
    effectiveClinicId,
  };
};
