import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { updateUserProfile } from "@/api/usersApi";
import { useAuthStore } from "@/store/useAuthStore";

const editProfileSchema = z.object({
  first_name: z.string().min(2, "settings.profile.errFirstName"),
  last_name: z.string().min(2, "settings.profile.errLastName"),
  phone_number: z.string().regex(/^\d{10}$/, "settings.profile.errPhone"),
});

export type ProfileEditFormValues = z.infer<typeof editProfileSchema>;

export function useEditProfile() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const form = useForm<ProfileEditFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileEditFormValues) => {
      if (!userId) throw new Error("No user ID");
      return updateUserProfile(userId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const openEdit = (currentData: { firstName: string; lastName: string; phoneNumber: string | null }) => {
    form.reset({
      first_name: currentData.firstName,
      last_name: currentData.lastName,
      phone_number: currentData.phoneNumber ?? "",
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    form.reset();
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await updateMutation.mutateAsync(data);
      updateProfile({
        firstName: data.first_name,
        lastName: data.last_name,
        phoneNumber: data.phone_number,
      });
      toast.success(t("settings.profile.saveSuccess"));
      closeEdit();
    } catch {
      toast.error(t("settings.profile.saveError"));
    }
  });

  return {
    form,
    isEditOpen,
    isSubmitting: updateMutation.isPending,
    openEdit,
    closeEdit,
    handleSubmit,
  };
}
