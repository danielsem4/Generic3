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

// Step 1 — sends a verification code to the user's email to start a password
// reset. Always returns 200 regardless of whether the email exists (no enumeration).
export const requestPasswordReset = (payload: { email: string }) =>
  api.post("/api/v1/auth/password/forgot/", payload);

// Step 2 — verifies the emailed code. 200 = valid, 400 = invalid/expired.
export const verifyResetCode = (payload: { email: string; code: string }) =>
  api.post("/api/v1/auth/password/verify-code/", payload);

// Step 3 — sets a new password after the code has been verified server-side.
export const resetPassword = (payload: { email: string; new_password: string }) =>
  api.post("/api/v1/auth/password/reset/", payload);

export const selectClinic = (payload: { user_id: string; clinic_id: string }) =>
  api.post<{ user: IAuthUser }>("/api/v1/auth/sessions/select-clinic/", payload);

export const refreshToken = () =>
  api.post("/api/v1/auth/tokens/refresh/");

export const getCurrentUser = () =>
  api.get<IAuthUser>("/api/v1/users/me/");
