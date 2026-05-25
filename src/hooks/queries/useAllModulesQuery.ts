import { useQuery } from "@tanstack/react-query";
import { getAllModules } from "@/api/modulesApi";

export const useAllModulesQuery = (p0: { gcTime: number; staleTime: number; }) => {
  return useQuery({
    queryKey: ["modules"],
    queryFn: getAllModules,
  });
};
