import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { IUser } from "@/common/Users";
import {
  updateClinicManager,
  deleteClinicManager,
} from "@/api/usersApi";

const editSchema = z.object({
  first_name: z.string().min(2, "clinicManagers.errFirstName"),
  last_name: z.string().min(2, "clinicManagers.errLastName"),
  phone_number: z.string().min(7, "clinicManagers.errPhone"),
});

export type ManagerEditFormValues = z.infer<typeof editSchema>;

export function useClinicManagerActions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [managerToEdit, setManagerToEdit] = useState<IUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<IUser | null>(null);
  const [managerForClinicSelect, setManagerForClinicSelect] = useState<IUser | null>(null);
  const [isClinicSelectOpen, setIsClinicSelectOpen] = useState(false);

  const form = useForm<ManagerEditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { first_name: "", last_name: "", phone_number: "" },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["users", "clinic-managers"] });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ManagerEditFormValues }) =>
      updateClinicManager(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClinicManager,
    onSuccess: invalidate,
  });

  const openEdit = (manager: IUser) => {
    setManagerToEdit(manager);
    form.reset({
      first_name: manager.first_name,
      last_name: manager.last_name,
      phone_number: manager.phone_number ?? "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const openDelete = (manager: IUser) => setManagerToDelete(manager);
  const closeDelete = () => setManagerToDelete(null);

  const handleView = (manager: IUser) => {
    if (manager.clinics.length === 0) {
      navigate("/clinic");
    } else if (manager.clinics.length === 1) {
      navigate("/clinic", { state: { clinicId: manager.clinics[0].id } });
    } else {
      setManagerForClinicSelect(manager);
      setIsClinicSelectOpen(true);
    }
  };

  const handleClinicSelect = (clinicId: string) => {
    setIsClinicSelectOpen(false);
    setManagerForClinicSelect(null);
    navigate("/clinic", { state: { clinicId } });
  };

  const closeClinicSelect = () => {
    setIsClinicSelectOpen(false);
    setManagerForClinicSelect(null);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!managerToEdit) return;
    try {
      await updateMutation.mutateAsync({ id: managerToEdit.id, data });
      closeForm();
    } catch {
      toast.error("clinicManagers.saveError");
    }
  });

  const handleDelete = async () => {
    if (!managerToDelete) return;
    try {
      await deleteMutation.mutateAsync(managerToDelete.id);
      closeDelete();
    } catch {
      toast.error("clinicManagers.deleteError");
    }
  };

  return {
    form,
    isFormOpen,
    managerToEdit,
    managerToDelete,
    managerForClinicSelect,
    isClinicSelectOpen,
    isSubmitting: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    handleView,
    handleClinicSelect,
    closeClinicSelect,
    handleSubmit,
    handleDelete,
  };
}
