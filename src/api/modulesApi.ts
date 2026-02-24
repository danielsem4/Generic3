import api from "@/lib/axios";
import type { IUserModule } from "@/common/Users";

export const getModules = async (): Promise<IUserModule[]> => {
  const response = await api.get<IUserModule[]>("/api/v1/modules");
  return response.data;
};
