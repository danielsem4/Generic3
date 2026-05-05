import { useQuery } from "@tanstack/react-query";
import { getClinicStatistics } from "@/api/statisticsApi";

export const useStatisticsQuery = (clinicId: string | null) => {
  return useQuery({
    queryKey: ["clinic-statistics", clinicId],
    queryFn: () => getClinicStatistics(clinicId!),
    enabled: !!clinicId,
  });
};
