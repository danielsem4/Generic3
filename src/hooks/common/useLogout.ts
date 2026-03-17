import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { logout } from "@/api/authApi";

export function useLogout() {
  const { logout: clearStore } = useAuthStore();
  const navigate = useNavigate();

  return async () => {
    try {
      await logout();
    } finally {
      clearStore();
      navigate("/", { replace: true });
    }
  };
}
