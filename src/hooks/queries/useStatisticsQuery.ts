import { useQuery } from "@tanstack/react-query";
import type { IClinicStatisticsResponse } from "@/common/types/statistics";

// TODO: swap to real API when backend is ready:
// import { getClinicStatistics } from "@/api/statisticsApi";

function getMockStatistics(): Promise<IClinicStatisticsResponse> {
  return Promise.resolve({
    total_doctors: 12,
    total_patients: 248,
    research_patients: 67,
    non_research_patients: 181,
    modules: [
      {
        module_id: 1,
        module_name: "Medications",
        chart_type: "bar",
        data_points: [
          { label: "Prescribed", value: 320 },
          { label: "Dispensed", value: 285 },
          { label: "Pending", value: 35 },
          { label: "Expired", value: 12 },
        ],
      },
      {
        module_id: 2,
        module_name: "Questionnaires",
        chart_type: "line",
        data_points: [
          { label: "Jan", value: 45 },
          { label: "Feb", value: 52 },
          { label: "Mar", value: 61 },
          { label: "Apr", value: 58 },
          { label: "May", value: 73 },
          { label: "Jun", value: 80 },
        ],
      },
      {
        module_id: 3,
        module_name: "Activities",
        chart_type: "pie",
        data_points: [
          { label: "Workshops", value: 28 },
          { label: "Training", value: 15 },
          { label: "Shifts", value: 42 },
          { label: "Meetings", value: 10 },
        ],
      },
      {
        module_id: 4,
        module_name: "Memory",
        chart_type: "bar",
        data_points: [
          { label: "Completed", value: 156 },
          { label: "In Progress", value: 43 },
          { label: "Not Started", value: 89 },
        ],
      },
      {
        module_id: 5,
        module_name: "CDT",
        chart_type: "line",
        data_points: [
          { label: "Week 1", value: 22 },
          { label: "Week 2", value: 28 },
          { label: "Week 3", value: 31 },
          { label: "Week 4", value: 35 },
        ],
      },
    ],
  });
}

export const useStatisticsQuery = (clinicId: string | null) => {
  return useQuery({
    queryKey: ["clinic-statistics", clinicId],
    // swap to: () => getClinicStatistics(clinicId!) when backend is ready
    queryFn: () => getMockStatistics(),
    enabled: !!clinicId,
  });
};
