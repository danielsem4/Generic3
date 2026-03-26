import { useQuery } from "@tanstack/react-query";
import { getAllModules } from "@/api/modulesApi";

export const useAllModulesQuery = () => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: getAllModules,
  });
};
