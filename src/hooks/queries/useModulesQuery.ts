import { useQuery } from "@tanstack/react-query";
import { getClinicModules } from "@/api/modulesApi";

export const useModulesQuery = (clinicId: string | null) => {
  return useQuery({
    queryKey: ["clinic-modules", clinicId],
    queryFn: () => getClinicModules(clinicId!),
    enabled: !!clinicId,
  });
};
