import { useQuery } from "@tanstack/react-query";
import { fetchPublicMeasurements } from "@/api/measurementsApi";

export function usePublicMeasurementsQuery() {
  return useQuery({
    queryKey: ["publicMeasurements"],
    queryFn: fetchPublicMeasurements,
  });
}
