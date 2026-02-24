import axios from "axios";
import type { IUser } from "@/common/Users";

export const getUsers = async (
  clinicId: number,
  userId: number,
): Promise<IUser[]> => {
  const url = `/api/v1/users/${clinicId}/user/${userId}/`;
  console.log(`we call now for url: ${url}`);

  const response = await axios.get<IUser | IUser[]>(url, {
    withCredentials: true,
  });
  return Array.isArray(response.data) ? response.data : [response.data];
};
