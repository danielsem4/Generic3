import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getAllSystemActivities, createActivity, deleteActivity } from "@/api/activitiesApi";
import { activitySchema, type ActivityFormValues } from "../schema/activitySchema";
import type { IGlobalActivity } from "@/common/types/activities";

export function useAdminActivities() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: activities = [], isLoading, error } = useQuery<IGlobalActivity[]>({
    queryKey: ["global-activities"],
    queryFn: getAllSystemActivities,
    select: (data) =>
      [...data].sort((a, b) => a.activity_name.localeCompare(b.activity_name)),
  });

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<IGlobalActivity | null>(null);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: { activity_name: "", activity_description: "" },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["global-activities"] });

  const createMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: invalidate,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const filtered = activities.filter((act) =>
    act.activity_name.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreate = () => {
    form.reset({ activity_name: "", activity_description: "" });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const openDelete = (activity: IGlobalActivity) => setActivityToDelete(activity);
  const closeDelete = () => setActivityToDelete(null);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync(data);
      closeForm();
    } catch {
      toast.error(t("activities.addError"));
    }
  });

  const handleDelete = async () => {
    if (!activityToDelete) return;
    try {
      await deleteMutation.mutateAsync(activityToDelete.id);
      closeDelete();
    } catch {
      toast.error(t("activities.deleteError"));
    }
  };

  const isSubmitting = createMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return {
    filtered,
    isLoading,
    error,
    search,
    form,
    isFormOpen,
    activityToDelete,
    isSubmitting,
    isDeleting,
    handleSearchChange,
    openCreate,
    closeForm,
    openDelete,
    closeDelete,
    handleSubmit,
    handleDelete,
  };
}
