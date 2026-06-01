import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  patientBaseSchema,
  researchPatientSchema,
  type PatientType,
  type PatientFormValues,
  type ResearchPatientFormValues,
} from "../schema/patientsSchema";
import { useAddPatient } from "./useAddPatient";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useAddPatientDialog() {
  const [open, setOpen] = useState(false);
  const [patientType, setPatientType] = useState<PatientType>("patient");
  const { addPatient, isSubmitting } = useAddPatient();
  const [error, setErrorMessage] = useState<string | null>(null); 
  const { t } = useTranslation();

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
    setErrorMessage(null);
    patientForm.reset();
    researchForm.reset();
  };

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      patientForm.reset();
      researchForm.reset();
      setPatientType("patient");
      setErrorMessage(null);
    }
  };

  const onSubmitPatient = async (data: PatientFormValues) => {
    try {
      setErrorMessage(null);

      await addPatient({ ...data, patientType: "patient" });

      patientForm.reset();
      setOpen(false);
    } catch (e: unknown) {
      console.error("Failed to add patient:", e);
      setOpen(false); 
      patientForm.reset();
      toast.error(t("patients.patientAlreadyExistsError"));
    }
  };

  const onSubmitResearch = async (data: ResearchPatientFormValues) => {
    try {
      setErrorMessage(null);

      await addPatient({ ...data, patientType: "research" });

      researchForm.reset();
      setOpen(false);
    } catch (e: unknown) {   
      console.error("Failed to add patient:", e);   
      setOpen(false);
      researchForm.reset();
      toast.error(t("patients.patientAlreadyExistsError"));
    }
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
    errorMessage: error, 
  };
}
