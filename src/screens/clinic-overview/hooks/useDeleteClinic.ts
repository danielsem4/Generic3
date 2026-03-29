import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteClinic } from "@/api/clinicsApi";

export function useDeleteClinic(clinicId: string | null) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteClinic(clinicId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["users", "clinic-managers"] });
      toast.success(t("clinic.deleteSuccess"));
      navigate("/clinic-managers");
    },
    onError: () => {
      toast.error(t("clinic.deleteError"));
    },
  });

  const openDelete = () => setIsDeleteOpen(true);
  const closeDelete = () => setIsDeleteOpen(false);

  const handleDelete = async () => {
    if (!clinicId) return;
    await deleteMutation.mutateAsync();
    closeDelete();
  };

  return {
    isDeleteOpen,
    isDeleting: deleteMutation.isPending,
    openDelete,
    closeDelete,
    handleDelete,
  };
}
