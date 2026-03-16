import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import i18n from "@/i18n";

const api = axios.create({
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = String(error?.config?.url ?? "");

    const isLoginRequest = url.includes("/api/v1/auth/sessions/");

    if (status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();
      toast.error(i18n.t("common.sessionExpired"));
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
