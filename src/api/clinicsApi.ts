import api from "@/lib/axios";
import type { IClinicOption } from "@/api/authApi";
import type { IClinic } from "@/common/types/clinic";

interface INewManagerPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

interface IExistingManagerPayload {
  user_id: string;
}

export interface ICreateClinicPayload {
  clinic_name: string;
  clinic_url: string;
  clinic_image_url?: string;
  is_research_clinic: boolean;
  modules: string[];
  clinic_manager: INewManagerPayload | IExistingManagerPayload;
}

export const createClinic = async (
  payload: ICreateClinicPayload,
): Promise<IClinicOption> => {
  const response = await api.post<IClinicOption>("/api/v1/clinics/", payload);
  return response.data;
};

export const getClinicDetails = async (clinicId: string): Promise<IClinic> => {
  const response = await api.get<IClinic>(`/api/v1/clinics/${clinicId}/`);
  return response.data;
};

export interface IUpdateClinicPayload {
  clinic_name?: string;
  clinic_url?: string;
  clinic_image_url?: string;
  is_research_clinic?: boolean;
  clinic_manager_id?: string;
}

export const updateClinic = async (
  clinicId: string,
  data: IUpdateClinicPayload,
): Promise<IClinic> => {
  const response = await api.patch<IClinic>(`/api/v1/clinics/${clinicId}/`, data);
  return response.data;
};
