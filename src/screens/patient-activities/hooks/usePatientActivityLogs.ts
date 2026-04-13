import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPatientActivityLogs } from "@/api/activitiesApi";
import type { IActivityLogFilters } from "@/common/types/activities";

export function usePatientActivityLogs(clinicId: string, userId: string) {
  const [filters, setFilters] = useState<IActivityLogFilters>({
    activity_name: undefined,
    start_date: undefined,
  });

  const {
    data: activityLogs = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patient-activity-logs", clinicId, userId],
    queryFn: () => getPatientActivityLogs(clinicId, userId),
    enabled: Boolean(clinicId && userId),
  });

  const filteredLogs = activityLogs.filter((log) => {
    const matchesActivity =
      !filters.activity_name ||
      log.activity_name.toLowerCase().includes(filters.activity_name.toLowerCase());

    const matchesStartDate =
      !filters.start_date || log.time_done >= filters.start_date;

    return matchesActivity && matchesStartDate;
  });

  const handleFilterChange = (updated: Partial<IActivityLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      activity_name: undefined,
      start_date: undefined,
    });
  };

  return {
    activityLogs: filteredLogs,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
    isLoading,
    error,
  };
}