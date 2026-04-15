import { Navigate } from "react-router-dom";
import { useRole } from "@/hooks/common/useRole";
import { ROLE_HOME_PATH } from "@/common/types/Role";

export default function HomeRedirect() {
  const role = useRole();
  if (!role) return null;
  return <Navigate to={ROLE_HOME_PATH[role]} replace />;
}
