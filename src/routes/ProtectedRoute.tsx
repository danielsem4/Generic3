import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export const ProtectedRoute = ({ children, isLoading }: ProtectedRouteProps) => {
  const userId = useAuthStore((s) => s.userId);

  if (isLoading) return null;

  if (!userId) return <Navigate to="/" replace />;

  return children;
};
