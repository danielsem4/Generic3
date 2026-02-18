import axios from "axios";
import type { IAuthUser } from "@/common/types/User";


export const getUsers = async (): Promise<IAuthUser[]> => {
  const url = `${import.meta.env.VITE_API_URL_DEV}users/1/user/3/`;

  const response = await axios.get<IAuthUser | IAuthUser[]>(url, {
    withCredentials: true,
  });

  console.log("API response:", response.data);
  return Array.isArray(response.data) ? response.data : [response.data];

};
