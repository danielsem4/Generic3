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
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error(i18n.t("common.sessionExpired"));
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
