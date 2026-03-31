import api from "@/lib/axios";
import type { IClinicStatisticsResponse } from "@/common/types/statistics";

export const getClinicStatistics = async (
  clinicId: string,
): Promise<IClinicStatisticsResponse> => {
  const response = await api.get<IClinicStatisticsResponse>(
    `/api/v1/clinics/${clinicId}/statistics/`,
  );
  return response.data;
};
