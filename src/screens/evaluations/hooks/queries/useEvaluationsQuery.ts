import { useQuery } from "@tanstack/react-query";
import { fetchEvaluations } from "@/api/evaluationApi";

export function useEvaluationsQuery(clinicId: string | null) {
  return useQuery({
    queryKey: ["evaluations", clinicId],
    queryFn: () => fetchEvaluations(clinicId!),
    enabled: !!clinicId,
  });
}
