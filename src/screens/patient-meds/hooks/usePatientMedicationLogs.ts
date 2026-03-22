import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPatientMedicationLogs } from "@/api/medicationService";
import { useAuthStore } from "@/store/useAuthStore";
import type { IMedicationLogFilters } from "../schema/patientMedicationsSchema";

export function usePatientMedicationLogs(patientId: string) {
  const clinicId = useAuthStore((state) => state.clinicId);

  const [filters, setFilters] = useState<IMedicationLogFilters>({});

  const { data: intakeLogs = [], refetch } = useQuery({
    queryKey: [
      "patient-medication-logs",
      clinicId,
      patientId,
      filters.med_name ?? null,
      filters.start_date ?? null,
    ],
    queryFn: () => fetchPatientMedicationLogs(clinicId!, patientId, filters),
    enabled: !!clinicId && !!patientId,
  });

  const handleFilterChange = (updated: Partial<IMedicationLogFilters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return {
    intakeLogs,
    filters,
    handleFilterChange,
    handleResetFilters,
    refetch,
  };
}
