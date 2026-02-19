import { apiClient } from "@/lib/apiClient";
import type { IAuthUser } from "@/types/user.types";
import type { LoginCredentials } from "../types/auth.types";

export const loginUser = async (credentials: LoginCredentials): Promise<IAuthUser> => {
  const { data } = await apiClient.post<IAuthUser>("auth/login/", credentials);
  return data;
};
