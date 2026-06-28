import { useQuery } from "@tanstack/react-query";
import { fetchGraphData } from "@/api/graphApi";

export function useGraphData(
  graphId: string,
  patientId: string | undefined,
  clinicId: string | null,
  date?: string,
) {
  return useQuery({
    queryKey: ["graph-data", clinicId, graphId, patientId, date],
    queryFn: () =>
      fetchGraphData(clinicId!, graphId, {
        patientId: patientId!,
        startDate: date || undefined,
        endDate: date || undefined,
      }),
    enabled: !!clinicId && !!patientId && !!graphId,
  });
}
