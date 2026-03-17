import api from "@/lib/axios";
import type { IUser, IPaginatedResponse } from "@/common/Users";

export interface ICreatePatientPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password?: string;
  role: string;
  clinic_id: string | number;
}

export const getUsers = async (
  clinicId: number,
  userId: string,
): Promise<IUser[]> => {
  const url = `/api/v1/users/${clinicId}/user/${userId}/`;
  const response = await api.get<IUser | IUser[]>(url);
  return Array.isArray(response.data) ? response.data : [response.data];
};

export const getClinicManagers = async (): Promise<IUser[]> => {
  const response = await api.get<IPaginatedResponse<IUser>>(
    "/api/v1/users/clinic-managers/",
  );
  return response.data.results;
};

export const getDoctors = async (): Promise<IUser[]> => {
  const response = await api.get<IPaginatedResponse<IUser>>(
    "/api/v1/users/doctors/",
  );
  return response.data.results;
};

export const getPatients = async (): Promise<IUser[]> => {
  const response = await api.get<IPaginatedResponse<IUser>>(
    "/api/v1/users/patients/",
  );
  return response.data.results;
};

export const createPatient = async (
  payload: ICreatePatientPayload,
): Promise<IUser> => {
  console.log({ payload });
  const response = await api.post<IUser>(`/api/v1/users/patients/`, payload);
  return response.data;
};

export interface ICreateDoctorPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  clinic_id: string | number;
}

export const createDoctor = async (
  payload: ICreateDoctorPayload,
): Promise<IUser> => {
  const response = await api.post<IUser>(`/api/v1/users/doctors/`, payload);
  return response.data;
};
