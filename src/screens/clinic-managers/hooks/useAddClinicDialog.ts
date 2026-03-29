import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  clinicSchema,
  STEP1_FIELDS,
  STEP3_CREATE_FIELDS,
  STEP3_EXISTING_FIELDS,
  type ClinicFormValues,
} from "../Schema/clinicSchema";
import { useAddClinic } from "./useAddClinic";

export const TOTAL_STEPS = 3;

export function useAddClinicDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { addClinic, isSubmitting } = useAddClinic();

  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      clinicName: "",
      clinicUrl: "",
      clinicType: "STANDARD",
      clinicImageUrl: "",
      availableModules: [],
      managerMode: "create",
      managerFirstName: "",
      managerLastName: "",
      managerEmail: "",
      managerPhone: "",
      managerPassword: "",
      selectedManagerId: "",
    },
    mode: "onChange",
  });

  const handleNext = async () => {
    let valid = false;
    if (step === 1) valid = await form.trigger([...STEP1_FIELDS]);
    if (step === 2) valid = true;
    if (valid) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
      setStep(1);
      setIsSuccess(false);
    }
  };

  const handleSuccessClose = () => handleClose(false);

  const onSubmit = async (data: ClinicFormValues) => {
    const step3Fields = data.managerMode === "create" ? [...STEP3_CREATE_FIELDS] : [...STEP3_EXISTING_FIELDS];
    const valid = await form.trigger(step3Fields);
    if (!valid) return;
    try {
      await addClinic(data);
      setIsSuccess(true);
    } catch {
      toast.error("Failed to create clinic. Please try again.");
    }
  };

  return {
    open,
    step,
    isSuccess,
    form,
    isSubmitting,
    handleNext,
    handleBack,
    handleClose,
    handleSuccessClose,
    onSubmit,
  };
}
