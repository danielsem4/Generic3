import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchGraphStructure } from "@/api/graphApi";

export function useGraphStructureQuery(graphId: string | undefined) {
  const clinicId = useAuthStore((s) => s.clinicId);

  return useQuery({
    queryKey: ["graph-structure", graphId, clinicId],
    queryFn: () => fetchGraphStructure(clinicId!, graphId!),
    enabled: !!clinicId && !!graphId,
  });
}
