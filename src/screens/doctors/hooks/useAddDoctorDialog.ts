import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema, type DoctorFormValues } from "../Schema/doctorSchema";
import { useAddDoctor } from "./useAddDoctor";

export function useAddDoctorDialog() {
  const [open, setOpen] = useState(false);
  const { addDoctor, isSubmitting } = useAddDoctor();

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    mode: "onChange",
  });

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) form.reset();
  };

  const onSubmit = async (data: DoctorFormValues) => {
    await addDoctor(data);
    form.reset();
    setOpen(false);
  };

  return { open, form, isSubmitting, handleClose, onSubmit };
}
