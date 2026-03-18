import api from "@/lib/axios";
import type { IClinicOption } from "@/api/authApi";
import type { IUser } from "@/common/Users";

export interface ICreateClinicPayload {
  name: string;
  clinic_url: string;
  clinic_type: "STANDARD" | "RESEARCH";
  available_modules: string[];
  logo?: File;
}

export interface ICreateClinicManagerPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: "CLINIC_MANAGER";
  clinic_id: string | number;
}

export const createClinic = async (
  payload: ICreateClinicPayload,
): Promise<IClinicOption> => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("clinic_url", payload.clinic_url);
  formData.append("clinic_type", payload.clinic_type);
  payload.available_modules.forEach((m) =>
    formData.append("available_modules", m),
  );
  if (payload.logo) {
    formData.append("logo", payload.logo);
  }
  const response = await api.post<IClinicOption>("/api/v1/clinics/", formData);
  return response.data;
};

export const createClinicManager = async (
  payload: ICreateClinicManagerPayload,
): Promise<IUser> => {
  const response = await api.post<IUser>(
    "/api/v1/users/clinic-managers/",
    payload,
  );
  return response.data;
};

export interface IAttachClinicManagerPayload {
  clinicId: string;
  managerId: string;
}

// TODO: Replace placeholder URL with real endpoint when available
export const attachClinicManager = async (
  payload: IAttachClinicManagerPayload,
): Promise<void> => {
  await api.post(`/api/v1/clinics/${payload.clinicId}/assign-manager/`, {
    manager_id: payload.managerId,
  });
};
