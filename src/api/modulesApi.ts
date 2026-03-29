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

export const getAllModules = async (): Promise<IModule[]> => {
  const response = await api.get<IModule[]>("/api/v1/modules/");
  return response.data;
};

interface IModulePayload {
  module_name: string;
  module_description?: string;
}

export const createModule = async (payload: IModulePayload): Promise<IModule> => {
  const response = await api.post<IModule>("/api/v1/modules/", payload);
  return response.data;
};

export const updateModule = async (id: number, payload: IModulePayload): Promise<IModule> => {
  const response = await api.patch<IModule>(`/api/v1/modules/${id}/`, payload);
  return response.data;
};

export const deleteModule = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/modules/${id}/`);
};

export const addClinicModule = async (
  clinicId: string,
  moduleId: number,
): Promise<void> => {
  await api.post(`/api/v1/clinics/${clinicId}/modules/`, { module_id: moduleId });
};

export const getAvailableClinicModules = async (
  clinicId: string,
): Promise<IModule[]> => {
  const response = await api.get<IModule[]>(
    `/api/v1/clinics/${clinicId}/modules/available/`,
  );
  return response.data;
};

export const removeClinicModule = async (
  clinicId: string,
  moduleId: number,
): Promise<void> => {
  await api.delete(`/api/v1/clinics/${clinicId}/modules/${moduleId}/`);
};
