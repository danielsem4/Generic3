import { apiClient } from "@/lib/apiClient";
import type { IAuthUser } from "@/types/user.types";

export const getUsers = async (): Promise<IAuthUser[]> => {
  const { data } = await apiClient.get<IAuthUser | IAuthUser[]>("users/1/user/3/");
  console.log("API response:", data);
  return Array.isArray(data) ? data : [data];
};
