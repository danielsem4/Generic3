import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import type { IClinicActivity } from "@/common/types/activities";
import { getClinicActivities } from "@/api/activitiesApi";

export const useClinicActivities = () => {
  const { clinicId, role } = useAuthStore();

  const { data: activities = [], isLoading, error } = useQuery<IClinicActivity[]>({
    queryKey: ["clinic-activities", clinicId],
    queryFn: () => getClinicActivities(clinicId || ""),
    enabled: !!clinicId,
    select: (data) => {
      return [...data].sort((a, b) =>
        a.activity_name.localeCompare(b.activity_name)
      );
    },
  });

  const isManager = role === "CLINIC_MANAGER" || role === "ADMIN";

  return {
    activities,
    isLoading,
    error,
    isManager
  };
};