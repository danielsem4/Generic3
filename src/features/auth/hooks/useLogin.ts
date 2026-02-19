import { useMutation } from "@tanstack/react-query";
import type { IAuthUser } from "@/types/user.types";
import type { LoginCredentials } from "../types/auth.types";
import { loginUser } from "../api/auth.api";

export const useLogin = () => {
  return useMutation<IAuthUser, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};
