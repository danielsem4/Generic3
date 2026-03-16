import type { IAuthUser, ISafeUser } from "@/common/types/User";
import { sanitizeUser } from "@/common/types/User";
import type { LoginCredentials } from "./LoginCredentails";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface LoginResponse {
  user: IAuthUser;
}

async function loginUser(credentials: LoginCredentials): Promise<ISafeUser> {
  const url = "/api/v1/auth/sessions/";

  const response = await api.post<LoginResponse>(url, credentials);
  console.log("loginUser");
  console.log({ response });
  return sanitizeUser(response.data.user);
}

export const useLogin = () => {
  return useMutation<ISafeUser, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};
