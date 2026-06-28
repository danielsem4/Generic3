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
    isRefetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["patient-activity-logs", clinicId, userId, filters],
    queryFn: () => getPatientActivityLogs(clinicId, userId, filters),
    enabled: Boolean(clinicId && userId),
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
    activityLogs,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
    isRefetching,
    isLoading,
    error,
  };
}