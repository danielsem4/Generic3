import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { userId, isAdmin } = useAuthStore();

  if (!userId && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
