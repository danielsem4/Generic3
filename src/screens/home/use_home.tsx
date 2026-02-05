/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { IAuthUser } from "@/common/types/User";

export type HomeDataResponse = {
  id: string;
  status: string;
  method: string;
  amount: number;
};
async function homedata(): Promise<IAuthUser> {
  const response = await axios.get<IAuthUser>(
    `${import.meta.env.VITE_API_URL_DEV}auth/home/`,
    { withXSRFToken: true }
  );
  return response.data; 
}

export const useHomeData = () => {
  return useQuery <IAuthUser>({
    queryKey: ["home_data"], 
    queryFn: homedata,   
  });
};