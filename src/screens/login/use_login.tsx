import type { IAuthUser } from "@/common/types/User";
import type { LoginCredentials } from "./LoginCredentails";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

async function loginUser(credentials: LoginCredentials): Promise<IAuthUser> {
  const url = "/api/v1/auth/login/"; 
  
  const response = await axios.post<IAuthUser>(url, credentials, {
    withCredentials: true, // חשוב מאוד אם השרת משתמש ב-Cookies/Sessions
    withXSRFToken: true,
  });
  return response.data;
  }

export const useLogin = () => {
  return useMutation<IAuthUser, Error, LoginCredentials>({
    mutationFn: loginUser,
  });
};