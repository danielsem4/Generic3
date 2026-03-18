import { useMutation } from "@tanstack/react-query";
import { login, type LoginResponse } from "@/api/authApi";
import type { LoginCredentials } from "./LoginCredentails";

export const useLogin = () =>
  useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const res = await login(credentials);
      return res.data;
    },
  });
