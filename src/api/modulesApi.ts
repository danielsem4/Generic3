import api from "@/lib/axios";
import type { IModule } from "@/common/types/patientDetails";

export const getClinicModules = async (
  clinicId: string,
): Promise<IModule[]> => {
  const response = await api.get<IModule[]>(
    `/api/v1/clinics/${clinicId}/modules/`,
  );
  return response.data;
};
