import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IUser } from "@/common/Users";
import { updateUser, deleteUser } from "@/api/usersApi";

export type UserEditFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

interface UseUserActionsArgs {
  queryKey: readonly unknown[];
  ns: string;
}

export function useUserActions({ queryKey, ns }: UseUserActionsArgs) {
  const queryClient = useQueryClient();
  const [userToEdit, setUserToEdit] = useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<IUser | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const editSchema = z.object({
    first_name: z.string().min(2, `${ns}.errFirstName`),
    last_name: z.string().min(2, `${ns}.errLastName`),
    email: z.string().email(`${ns}.errEmail`),
    phone_number: z.string().min(7, `${ns}.errPhone`),
  });

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { first_name: "", last_name: "", email: "", phone_number: "" },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserEditFormValues }) =>
      updateUser(id, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: invalidate,
  });

  const openEdit = (user: IUser) => {
    setUserToEdit(user);
    form.reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number ?? "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const openDelete = (user: IUser) => setUserToDelete(user);
  const closeDelete = () => setUserToDelete(null);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!userToEdit) return;
    try {
      await updateMutation.mutateAsync({ id: userToEdit.id, data });
      closeForm();
    } catch {
      toast.error(`${ns}.saveError`);
    }
  });

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteMutation.mutateAsync(userToDelete.id);
      closeDelete();
    } catch {
      toast.error(`${ns}.deleteError`);
    }
  };

  return {
    form,
    isFormOpen,
    userToEdit,
    userToDelete,
    isSubmitting: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    handleSubmit,
    handleDelete,
  };
}
