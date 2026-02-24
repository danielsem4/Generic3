import type { IAuthUser } from "@/common/types/User";
import type { LoginCredentials } from "./LoginCredentails";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
  user: IAuthUser;
}

async function loginUser(credentials: LoginCredentials): Promise<IAuthUser> {
  const url = "/api/v1/auth/login/";

  const response = await api.post<LoginResponse>(url, credentials);
  return response.data.user;
}

export const useLogin = () => {
  return useMutation<IAuthUser, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};