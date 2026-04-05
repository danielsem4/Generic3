import { useState } from "react";
import { useClinicActivities } from "./useClinicActivities";

export function useActivitiesPage() {
  const { activities, isLoading, error, isManager } = useClinicActivities();
  const [search, setSearch] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtered = activities.filter((act) =>
    act.activity_name.toLowerCase().includes(search.toLowerCase())
  );

  const openDelete = (id: string) => setActivityToDelete(id);
  const closeDelete = () => setActivityToDelete(null);

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      // TODO: call delete API when backend endpoint exists
      console.log("Deleting activity:", activityToDelete);
      closeDelete();
    }
  };

  return {
    filtered,
    isLoading,
    error,
    isManager,
    search,
    activityToDelete,
    handleSearchChange,
    openDelete,
    closeDelete,
    handleDeleteConfirm,
  };
}
