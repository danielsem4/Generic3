import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "@/api/graphApi";

export function useGraphData(
  graphId: string,
  patientId: string | undefined,
  clinicId: string | null,
) {
  return useQuery({
    queryKey: ["graph-data", clinicId, graphId, patientId],
    queryFn: () => fetchGraphData(clinicId!, graphId, { patientId: patientId! }),
    enabled: !!clinicId && !!patientId && !!graphId,
  });
}
