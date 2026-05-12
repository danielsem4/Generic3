import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { createPatient } from "@/api/usersApi";
import type { PatientFormValues, ResearchPatientFormValues, PatientType } from "../schema/patientsSchema";

type AddPatientInput = (PatientFormValues | ResearchPatientFormValues) & { patientType: PatientType };

export function useAddPatient() {
  const queryClient = useQueryClient();
  const { clinicId } = useAuthStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: AddPatientInput) => {
      if (!clinicId) throw new Error("Missing clinicId");
      const isResearch = data.patientType === "research";
      const researchData = data as ResearchPatientFormValues & { patientType: PatientType };
      return createPatient({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        ...(isResearch && { password: researchData.password }),
        role: isResearch ? "RESEARCH_PATIENT" : "PATIENT",
        clinic_id: clinicId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { addPatient: mutateAsync, isSubmitting: isPending };
}
