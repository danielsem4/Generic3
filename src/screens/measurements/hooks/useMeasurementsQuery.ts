import { useQuery } from "@tanstack/react-query";
import { fetchMeasurements } from "@/api/measurementsApi";

export function useMeasurementsQuery(clinicId: string | null) {
  return useQuery({
    queryKey: ["measurements", clinicId],
    queryFn: () => fetchMeasurements(clinicId!),
    enabled: !!clinicId,
  });
}
