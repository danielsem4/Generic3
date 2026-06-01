import { useQuery } from "@tanstack/react-query";
import { fetchPublicEvaluations } from "@/api/evaluationApi";

export function usePublicEvaluationsQuery() {
  return useQuery({
    queryKey: ["publicEvaluations"],
    queryFn: fetchPublicEvaluations,
  });
}
