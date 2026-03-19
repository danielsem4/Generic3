import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import type { FieldError, UseFormRegister } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAddPatientDialog } from "../hooks/useAddPatientDialog";

interface FormFieldProps {
  id: string;
  type?: string;
  register: UseFormRegister<never>;
  error?: FieldError;
}

function FormField({ id, type = "text", register, error }: FormFieldProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1.5 flex-1 text-right">
      <label className="text-sm font-bold text-foreground flex items-center gap-1">
        {t(`patients.${id}Label`)}
        <span className="text-destructive">*</span>
      </label>
      <Input
        {...register(id as never)}
        type={type}
        placeholder={t(`patients.${id}Placeholder`)}
        className={error
          ? "border-destructive focus-visible:ring-destructive"
          : "border-border bg-background focus-visible:ring-primary"
        }
      />
      {error && (
        <p className="text-[10px] text-destructive font-medium leading-none">
          {t(error.message as string)}
        </p>
      )}
    </div>
  );
}

export function AddPatientsDialog() {
  const { t } = useTranslation();
  const {
    open,
    patientType,
    patientForm,
    researchForm,
    isSubmitting,
    handleTypeChange,
    handleClose,
    onSubmitPatient,
    onSubmitResearch,
  } = useAddPatientDialog();

  const isResearch = patientType === "research";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm transition-all">
          <UserPlus size={20} /> {t("patients.addNew")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-card border-border p-8" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-center text-foreground mb-4">
            {t("patients.registerTitle")}
          </DialogTitle>
        </DialogHeader>

        {/* Type toggle */}
        <div className="flex rounded-lg border border-border overflow-hidden mb-2">
          <button
            type="button"
            onClick={() => handleTypeChange("patient")}
            className={cn(
              "flex-1 py-2 text-sm font-semibold transition-colors",
              !isResearch
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {t("patients.togglePatient")}
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("research")}
            className={cn(
              "flex-1 py-2 text-sm font-semibold transition-colors",
              isResearch
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            {t("patients.toggleResearch")}
          </button>
        </div>

        {/* Patient form (no password) */}
        {!isResearch && (
          <form onSubmit={patientForm.handleSubmit(onSubmitPatient)} className="space-y-4">
            <div className="flex gap-4">
              <FormField id="firstName" register={patientForm.register as never} error={patientForm.formState.errors.firstName} />
              <FormField id="lastName" register={patientForm.register as never} error={patientForm.formState.errors.lastName} />
            </div>
            <div className="space-y-4">
              <FormField id="email" type="email" register={patientForm.register as never} error={patientForm.formState.errors.email} />
              <FormField id="phoneNumber" type="tel" register={patientForm.register as never} error={patientForm.formState.errors.phoneNumber} />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-6 transition-colors shadow-sm"
            >
              {t("patients.registerButton")}
            </Button>
          </form>
        )}

        {/* Research patient form (with password) */}
        {isResearch && (
          <form onSubmit={researchForm.handleSubmit(onSubmitResearch)} className="space-y-4">
            <div className="flex gap-4">
              <FormField id="firstName" register={researchForm.register as never} error={researchForm.formState.errors.firstName} />
              <FormField id="lastName" register={researchForm.register as never} error={researchForm.formState.errors.lastName} />
            </div>
            <div className="space-y-4">
              <FormField id="email" type="email" register={researchForm.register as never} error={researchForm.formState.errors.email} />
              <FormField id="phoneNumber" type="tel" register={researchForm.register as never} error={researchForm.formState.errors.phoneNumber} />
            </div>
            <div className="flex gap-4">
              <FormField id="password" type="password" register={researchForm.register as never} error={researchForm.formState.errors.password} />
              <FormField id="confirmPassword" type="password" register={researchForm.register as never} error={researchForm.formState.errors.confirmPassword} />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-6 transition-colors shadow-sm"
            >
              {t("patients.registerButton")}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
