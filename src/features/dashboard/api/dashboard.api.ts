import { apiClient } from "@/lib/apiClient";
import type { IAuthUser } from "@/types/user.types";

export const getUsers = async (clinicId: number, userId: number): Promise<IAuthUser[]> => {
  const { data } = await apiClient.get<IAuthUser | IAuthUser[]>(`users/${clinicId}/user/${userId}/`);
  return Array.isArray(data) ? data : [data];
};
