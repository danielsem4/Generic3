import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDoctor } from "@/api/usersApi";
import type { DoctorFormValues } from "../Schema/doctorSchema";

export function useAddDoctor() {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: DoctorFormValues) =>
      createDoctor({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        role: "DOCTOR",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "doctors"] });
    },
  });

  return { addDoctor: mutateAsync, isSubmitting: isPending };
}
