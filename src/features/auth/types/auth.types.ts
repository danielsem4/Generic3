import type { IAuthUser } from "@/types/user.types";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: IAuthUser;
}
