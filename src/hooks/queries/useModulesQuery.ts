import { useQuery } from "@tanstack/react-query";
import { getModules } from "@/api/modulesApi";

export const useModulesQuery = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: getModules,
    enabled,
  });
};
