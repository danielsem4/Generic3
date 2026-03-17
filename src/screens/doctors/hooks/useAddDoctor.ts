import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { createDoctor } from "@/api/usersApi";
import type { DoctorFormValues } from "../Schema/doctorSchema";

export function useAddDoctor() {
  const queryClient = useQueryClient();
  const { clinicId } = useAuthStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: DoctorFormValues) => {
      if (!clinicId) throw new Error("Missing clinicId");
      return createDoctor({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        role: "DOCTOR",
        clinic_id: clinicId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "doctors"] });
    },
  });

  return { addDoctor: mutateAsync, isSubmitting: isPending };
}
