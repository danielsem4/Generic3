import { useQuery } from "@tanstack/react-query";
import { fetchMeasurementVersions } from "@/api/measurementsApi";
import { useAuthStore } from "@/store/useAuthStore";

export function useMeasurementVersionsQuery(measurementId: string | undefined) {
  const clinicId = useAuthStore((s) => s.clinicId);
  return useQuery({
    queryKey: ["measurement-versions", measurementId],
    queryFn: () => fetchMeasurementVersions(clinicId!, measurementId!),
    enabled: !!clinicId && !!measurementId,
    staleTime: 30_000,
  });
}
