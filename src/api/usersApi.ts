import api from "@/lib/axios";
import type { IUser } from "@/common/Users";

export interface ICreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}

export const getUsers = async (
  clinicId: number,
  userId: number,
): Promise<IUser[]> => {
  const url = `/api/v1/users/${clinicId}/user/${userId}/`;

  const response = await api.get<IUser | IUser[]>(url);
  return Array.isArray(response.data) ? response.data : [response.data];
};

export const createUser = async (
  clinicId: number,
  payload: ICreateUserPayload,
): Promise<IUser> => {
  const response = await api.post<IUser>(`/api/v1/users/${clinicId}/user/`, payload);
  return response.data;
};
