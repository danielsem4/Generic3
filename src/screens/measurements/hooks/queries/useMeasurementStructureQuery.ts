import { useQuery } from "@tanstack/react-query";
import { fetchMeasurementStructure } from "@/api/measurementsApi";
import { useAuthStore } from "@/store/useAuthStore";

export function useMeasurementStructureQuery(
  measurementId: string | undefined,
) {
  const clinicId = useAuthStore((s) => s.clinicId);
  return useQuery({
    queryKey: ["measurement-structure", measurementId],
    queryFn: () => fetchMeasurementStructure(clinicId!, measurementId!),
    enabled: !!clinicId && !!measurementId,
  });
}
