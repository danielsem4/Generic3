import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEV,
  withCredentials: true,
  withXSRFToken: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("isAuthenticated");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
