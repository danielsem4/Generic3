import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientBaseSchema,
  researchPatientSchema,
  type PatientType,
  type PatientFormValues,
  type ResearchPatientFormValues,
} from "../Schema/patientsSchema";
import { useAddPatient } from "./useAddPatient";

export function useAddPatientDialog() {
  const [open, setOpen] = useState(false);
  const [patientType, setPatientType] = useState<PatientType>("patient");
  const { addPatient, isSubmitting } = useAddPatient();

  const patientForm = useForm<PatientFormValues>({
    resolver: zodResolver(patientBaseSchema),
    mode: "onChange",
  });

  const researchForm = useForm<ResearchPatientFormValues>({
    resolver: zodResolver(researchPatientSchema),
    mode: "onChange",
  });

  const handleTypeChange = (type: PatientType) => {
    setPatientType(type);
    patientForm.reset();
    researchForm.reset();
  };

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      patientForm.reset();
      researchForm.reset();
      setPatientType("patient");
    }
  };

  const onSubmitPatient = async (data: PatientFormValues) => {
    await addPatient({ ...data, patientType: "patient" });
    patientForm.reset();
    setOpen(false);
  };

  const onSubmitResearch = async (data: ResearchPatientFormValues) => {
    await addPatient({ ...data, patientType: "research" });
    researchForm.reset();
    setOpen(false);
  };

  return {
    open,
    patientType,
    patientForm,
    researchForm,
    isSubmitting,
    handleTypeChange,
    handleClose,
    onSubmitPatient,
    onSubmitResearch,
  };
}
