import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { addGlobalMedication } from "@/api/medicationService";
import {
  medicationSchema,
  type MedicationFormValues,
} from "../schema/medicationSchema";

export function useAddMedicationDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: { med_name: "", med_form: "", med_unit: "" },
    mode: "onChange",
  });

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) form.reset();
  };

  const onSubmit = async (data: MedicationFormValues) => {
    setIsSubmitting(true);
    try {
      await addGlobalMedication(data);
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      form.reset();
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { open, form, isSubmitting, handleClose, onSubmit };
}
