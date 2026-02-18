import type { IAuthUser } from "@/common/types/User";
import type { LoginCredentials } from "./LoginCredentails";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

async function loginUser(credentials: LoginCredentials): Promise<IAuthUser> {
  const response = await axios.post<IAuthUser>(`${import.meta.env.VITE_API_URL_DEV}auth/login/`,credentials,{
      withCredentials: true, 
      withXSRFToken: true,  
    }
  );

  return response.data;
}

export const useLogin = () => {
  return useMutation<IAuthUser, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};