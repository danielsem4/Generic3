import axios from "axios";
import type { IUserModule } from "@/common/Users";

export const getModules = async (): Promise<IUserModule[]> => {
  const response = await axios.get<IUserModule[]>("/api/v1/modules", {
    withCredentials: true,
  });
  return response.data;
};
