export type ChartType = "bar" | "line" | "pie";

export interface IStatisticsDataPoint {
  label: string;
  value: number;
}

export interface IModuleStatistics {
  module_id: number;
  module_name: string;
  chart_type: ChartType;
  data_points: IStatisticsDataPoint[];
}

export interface IClinicStatisticsResponse {
  total_doctors: number;
  total_patients: number;
  research_patients: number;
  non_research_patients: number;
  modules: IModuleStatistics[];
}
