import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useStatisticsQuery } from "@/hooks/queries/useStatisticsQuery";
import type { IModuleStatistics } from "@/common/types/statistics";

interface IStatisticsData {
  totalDoctors: number;
  totalPatients: number;
  researchPatients: number;
  nonResearchPatients: number;
  modules: IModuleStatistics[];
  selectedModule: IModuleStatistics | null;
  handleSelectModule: (moduleId: number) => void;
  isLoading: boolean;
  error: Error | null;
}

export function useStatistics(): IStatisticsData {
  const clinicId = useAuthStore((s) => s.clinicId);
  const { data, isLoading, error } = useStatisticsQuery(clinicId);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const modules = data?.modules ?? [];

  const activeId = selectedModuleId ?? modules[0]?.module_id ?? null;
  const selectedModule = modules.find((m) => m.module_id === activeId) ?? null;

  const handleSelectModule = (moduleId: number) => {
    setSelectedModuleId(moduleId);
  };

  return {
    totalDoctors: data?.total_doctors ?? 0,
    totalPatients: data?.total_patients ?? 0,
    researchPatients: data?.research_patients ?? 0,
    nonResearchPatients: data?.non_research_patients ?? 0,
    modules,
    selectedModule,
    handleSelectModule,
    isLoading,
    error: error as Error | null,
  };
}
