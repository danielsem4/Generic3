import { useQuery } from "@tanstack/react-query";
import { fetchGraphs } from "@/api/graphApi";

export function useGraphsQuery(clinicId: string | null) {
  return useQuery({
    queryKey: ["graphs", clinicId],
    queryFn: () => fetchGraphs(clinicId!),
    enabled: !!clinicId,
  });
}
