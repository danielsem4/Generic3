import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatientMedication } from "@/api/medicationService";
import { useAuthStore } from "@/store/useAuthStore";
import type {
  IPatientPrescription,
  PrescriptionFrequency,
} from "@/common/types/Medication";

export function useEditMedication(patientId: string) {
  const clinicId = useAuthStore((state) => state.clinicId);
  const queryClient = useQueryClient();

  const [dosage, setDosage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [frequency, setFrequency] = useState<PrescriptionFrequency>("DAILY");

  const initForm = (prescription: IPatientPrescription) => {
    setDosage(prescription.dosage);
    setStartDate(prescription.start_date);
    setEndDate(prescription.end_date);
    setFrequency(prescription.frequency);
  };

  const { mutate: submitEdit, isPending } = useMutation({
    mutationFn: (prescriptionId: string) =>
      updatePatientMedication(clinicId!, patientId, prescriptionId, {
        dosage,
        start_date: startDate,
        end_date: endDate,
        frequency,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-medications", clinicId, patientId],
      });
    },
  });

  return {
    dosage,
    setDosage,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    frequency,
    setFrequency,
    initForm,
    submitEdit,
    isPending,
  };
}
