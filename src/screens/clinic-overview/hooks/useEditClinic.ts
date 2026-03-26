import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { IClinic } from "@/common/types/clinic";
import { updateClinic } from "@/api/clinicsApi";
import { getClinicManagers } from "@/api/usersApi";
import type { IUser } from "@/common/Users";

const editSchema = z.object({
  clinic_name: z.string().min(2, "clinicManagers.errClinicName"),
  clinic_url: z.string().url("clinicManagers.errClinicUrl"),
  clinic_image_url: z.string().url("clinicManagers.errImageUrl").or(z.literal("")),
  is_research_clinic: z.boolean(),
  clinic_manager_id: z.string().min(1, "clinicManagers.errSelectManager"),
});

export type ClinicEditFormValues = z.infer<typeof editSchema>;

export function useEditClinic(clinicId: string | null) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const form = useForm<ClinicEditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      clinic_name: "",
      clinic_url: "",
      clinic_image_url: "",
      is_research_clinic: false,
      clinic_manager_id: "",
    },
  });

  const { data: clinicManagers = [] } = useQuery<IUser[]>({
    queryKey: ["users", "clinic-managers"],
    queryFn: getClinicManagers,
  });

  const updateMutation = useMutation({
    mutationFn: (data: ClinicEditFormValues) => {
      if (!clinicId) throw new Error("No clinic ID");
      return updateClinic(clinicId, {
        clinic_name: data.clinic_name,
        clinic_url: data.clinic_url,
        clinic_image_url: data.clinic_image_url || undefined,
        is_research_clinic: data.is_research_clinic,
        clinic_manager_id: data.clinic_manager_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinic-details", clinicId] });
    },
  });

  const openEdit = (clinic: IClinic) => {
    form.reset({
      clinic_name: clinic.clinic_name,
      clinic_url: clinic.clinic_url,
      clinic_image_url: clinic.clinic_image_url ?? "",
      is_research_clinic: clinic.is_research_clinic,
      clinic_manager_id: clinic.clinic_manager.id,
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
      closeEdit();
    } catch {
      toast.error("clinic.saveError");
    }
  });

  return {
    form,
    isEditOpen,
    isSubmitting: updateMutation.isPending,
    clinicManagers,
    openEdit,
    closeEdit,
    handleSubmit,
  };
}
