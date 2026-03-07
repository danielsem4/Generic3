import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_DEV,
  withCredentials: true,
  withXSRFToken: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);
