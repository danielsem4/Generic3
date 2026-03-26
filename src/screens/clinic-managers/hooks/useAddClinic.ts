import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClinic } from "@/api/clinicsApi";
import type { ClinicFormValues } from "../Schema/clinicSchema";

export function useAddClinic() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: ClinicFormValues) => {
      const clinic_manager =
        data.managerMode === "create"
          ? {
              first_name: data.managerFirstName,
              last_name: data.managerLastName,
              email: data.managerEmail,
              password: data.managerPassword,
              phone_number: data.managerPhone,
            }
          : { user_id: data.selectedManagerId };

      return createClinic({
        clinic_name: data.clinicName,
        clinic_url: data.clinicUrl,
        clinic_image_url: data.clinicImageUrl || undefined,
        is_research_clinic: data.clinicType === "RESEARCH",
        modules: data.availableModules,
        clinic_manager,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["users", "clinic-managers"] });
    },
  });

  return { addClinic: mutateAsync, isSubmitting: isPending };
}
