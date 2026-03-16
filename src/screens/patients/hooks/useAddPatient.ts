import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { createPatient } from "@/api/usersApi";
import type { PatientsFormValues } from "../Schema/patientsSchema";

export function useAddPatient() {
  const queryClient = useQueryClient();
  const { clinicId } = useAuthStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: PatientsFormValues) => {
      if (!clinicId) throw new Error("Missing clinicId");
      console.log({ data });
      return createPatient({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        password: data.password,
        role: "PATIENT",
        clinic_id: clinicId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { addPatient: mutateAsync, isSubmitting: isPending };
}
