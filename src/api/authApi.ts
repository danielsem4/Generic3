import api from "@/lib/axios";
import type { IAuthUser } from "@/common/types/User";

export interface IClinicOption {
  id: string;
  clinic_name: string;
  clinic_url: string;
  clinic_image_url: string | null;
  is_research_clinic: boolean;
}

export type LoginResponse =
  | { user: IAuthUser }
  | { requires_2fa: true; user_id: string }
  | { requires_clinic_selection: true; user_id: string; clinics: IClinicOption[] };

export const login = (credentials: { email: string; password: string }) =>
  api.post<LoginResponse>("/api/v1/auth/sessions/", credentials);

export const logout = () =>
  api.delete("/api/v1/auth/sessions/");

export const verify2FA = (payload: { user_id: string; code: string }) =>
  api.post<LoginResponse>("/api/v1/auth/2fa/verify/", payload);

// Sends a 2FA code to the user's email to start a password reset.
// Assumed endpoint — confirm exact URL/shape with backend.
export const requestPasswordReset = (payload: { email: string }) =>
  api.post<{ user_id: string }>("/api/v1/auth/password/forgot/", payload);

// Sets a new password after the 2FA code has been verified.
// Assumed endpoint — confirm exact URL/shape with backend.
export const resetPassword = (payload: { user_id: string; new_password: string }) =>
  api.post("/api/v1/auth/password/reset/", payload);

export const selectClinic = (payload: { user_id: string; clinic_id: string }) =>
  api.post<{ user: IAuthUser }>("/api/v1/auth/sessions/select-clinic/", payload);

export const refreshToken = () =>
  api.post("/api/v1/auth/tokens/refresh/");

export const getCurrentUser = () =>
  api.get<IAuthUser>("/api/v1/users/me/");
