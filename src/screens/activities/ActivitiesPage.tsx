import { useAuthStore } from "@/store/useAuthStore";
import { AdminActivitiesView } from "./components/AdminActivitiesView";
import { ClinicActivitiesView } from "./components/ClinicActivitiesView";
import { BackButton } from "@/components/ui/BackButton";

export default function ActivitiesPage() {
  const role = useAuthStore((s) => s.role);

  return (
    <div className="p-8 space-y-4 max-w-5xl mx-auto">
      <BackButton />

      {role === "ADMIN" ? (
        <AdminActivitiesView />
      ) : (
        <ClinicActivitiesView />
      )}
    </div>
  );
}