import { useAuthStore } from "@/store/useAuthStore";
import { AdminModulesView } from "./components/AdminModulesView";
import { ClinicManagerModulesView } from "./components/ClinicManagerModulesView";
import { ReadOnlyModulesView } from "./components/ReadOnlyModulesView";

export default function Modules() {
  const role = useAuthStore((s) => s.role);

  if (role === "ADMIN") return <AdminModulesView />;
  if (role === "CLINIC_MANAGER") return <ClinicManagerModulesView />;
  return <ReadOnlyModulesView />;
}
