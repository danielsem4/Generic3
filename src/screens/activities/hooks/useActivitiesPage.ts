import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { removeActivityFromClinic } from "@/api/activitiesApi";
import { useClinicActivities } from "./useClinicActivities";

export function useActivitiesPage() {
  const { t } = useTranslation();
  const { clinicId } = useAuthStore();
  const { activities, isLoading, error, isManager } = useClinicActivities();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filtered = activities.filter((act) =>
    act.activity_name.toLowerCase().includes(search.toLowerCase())
  );

  const openDelete = (id: string) => setActivityToDelete(id);
  const closeDelete = () => setActivityToDelete(null);

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const deleteMutation = useMutation({
    mutationFn: (activityId: string) =>
      removeActivityFromClinic(clinicId!, activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-activities", clinicId] });
      closeDelete();
    },
    onError: () => {
      toast.error(t("activities.deleteError"));
    },
  });

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      deleteMutation.mutate(activityToDelete);
    }
  };

  return {
    activities,
    filtered,
    isLoading,
    error,
    isManager,
    search,
    activityToDelete,
    isAddOpen,
    handleSearchChange,
    openDelete,
    closeDelete,
    openAdd,
    closeAdd,
    handleDeleteConfirm,
  };
}
