import { useQuery } from "@tanstack/react-query";
import { fetchEvaluationStructure } from "@/api/evaluationApi";
import { useAuthStore } from "@/store/useAuthStore";

export function useEvaluationStructureQuery(
  evaluationId: string | undefined,
) {
  const clinicId = useAuthStore((s) => s.clinicId);
  return useQuery({
    queryKey: ["evaluation-structure", evaluationId],
    queryFn: () => fetchEvaluationStructure(clinicId!, evaluationId!),
    enabled: !!clinicId && !!evaluationId,
  });
}
