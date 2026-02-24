import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { clinicId, userId } = useAuthStore();

  if (!clinicId || !userId) {
    return <Navigate to="/" replace />;
  }

  return children;
};
