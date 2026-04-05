import { useAuthStore } from "@/store/useAuthStore";
import { AdminActivitiesView } from "./components/AdminActivitiesView";
import { ClinicActivitiesView } from "./components/ClinicActivitiesView";

export default function ActivitiesPage() {
  const role = useAuthStore((s) => s.role);

  if (role === "ADMIN") return <AdminActivitiesView />;
  return <ClinicActivitiesView />;
}
