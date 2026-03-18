import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClinic, createClinicManager } from "@/api/clinicsApi";
import type { ClinicFormValues } from "../Schema/clinicSchema";

export function useAddClinic() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ClinicFormValues) => {
      const clinic = await createClinic({
        name: data.clinicName,
        clinic_url: data.clinicUrl,
        clinic_type: data.clinicType,
        available_modules: data.availableModules,
        logo: data.clinicLogoFile,
      });
      await createClinicManager({
        first_name: data.managerFirstName,
        last_name: data.managerLastName,
        email: data.managerEmail,
        phone_number: data.managerPhone,
        role: "CLINIC_MANAGER",
        clinic_id: clinic.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["users", "clinic-managers"] });
    },
  });

  return { addClinic: mutateAsync, isSubmitting: isPending };
}
