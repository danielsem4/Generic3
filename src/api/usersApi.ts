import axios from "axios";
import type { IAuthUser } from "@/common/types/User";

export const getUsers = async (clinicId: string, userId: string): Promise<IAuthUser[]> => {
  const url = `${import.meta.env.VITE_API_URL_DEV}users/${clinicId}/${userId}/`;
  console.log("API URL:", url);
  const response = await axios.get(url);
  console.log("API response:", response.data); 
  return Array.isArray(response.data) ? response.data : response.data.users || [];
};
