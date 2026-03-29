import { useQuery } from "@tanstack/react-query";
import { getAvailableClinicModules } from "@/api/modulesApi";

export const useAvailableModulesQuery = (clinicId: string | null) => {
  return useQuery({
    queryKey: ["available-modules", clinicId],
    queryFn: () => getAvailableClinicModules(clinicId!),
    enabled: !!clinicId,
  });
};
