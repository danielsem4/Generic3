import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAddPatientDialog } from "../hooks/useAddPatientDialog";
import { LoadingButton } from "@/components/ui/LoadingButton"; 
import type { FieldError, Path, UseFormRegister } from "react-hook-form";

type PatientFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type ResearchFormValues = PatientFormValues & {
  password: string;
  confirmPassword: string;
};

interface FormFieldProps<T extends Record<string, unknown>> {
   id: Path<T>; 
  type?: string;
  register: UseFormRegister<T>; 
  error?: FieldError;
}

function FormField<T extends Record<string, unknown>>({
  id,
  type = "text",
  register,
  error,
}: FormFieldProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1.5 flex-1 text-right">
      <label className="text-sm font-bold text-foreground flex items-center gap-1">
        {t(`patients.${String(id)}Label`)}
        <span className="text-destructive">*</span>
      </label>
      <Input
          {...register(id)}
        type={type}
        placeholder={t(`patients.${String(id)}Placeholder`)} 
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

        {/* toggle */}
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

        {/* PATIENT FORM */}
        {!isResearch && (
          <form onSubmit={patientForm.handleSubmit(onSubmitPatient)} className="space-y-4">
            <div className="flex gap-4">
              <FormField<PatientFormValues>
                id="firstName"
                register={patientForm.register}
                error={patientForm.formState.errors.firstName}
              />

              <FormField<PatientFormValues>
                id="lastName"
                register={patientForm.register}
                error={patientForm.formState.errors.lastName}
              />
            </div>

            <FormField<PatientFormValues>
              id="email"
              type="email"
              register={patientForm.register}
              error={patientForm.formState.errors.email}
            />

            <FormField<PatientFormValues>
              id="phoneNumber"
              type="tel"
              register={patientForm.register}
              error={patientForm.formState.errors.phoneNumber}
            />
            

            <LoadingButton type="submit" loading={isSubmitting}>
              {t("patients.registerButton")}
            </LoadingButton>
          </form>
        )}

        {/* RESEARCH FORM */}
        {isResearch && (
          <form onSubmit={researchForm.handleSubmit(onSubmitResearch)} className="space-y-4">
            <div className="flex gap-4">
              <FormField<ResearchFormValues>
                id="firstName"
                register={researchForm.register}
                error={researchForm.formState.errors.firstName}
              />

              <FormField<ResearchFormValues>
                id="lastName"
                register={researchForm.register}
                error={researchForm.formState.errors.lastName}
              />
            </div>

            <FormField<ResearchFormValues>
              id="email"
              type="email"
              register={researchForm.register}
              error={researchForm.formState.errors.email}
            />

            <FormField<ResearchFormValues>
              id="phoneNumber"
              type="tel"
              register={researchForm.register}
              error={researchForm.formState.errors.phoneNumber}
            />

            <FormField<ResearchFormValues>
              id="password"
              type="password"
              register={researchForm.register}
              error={researchForm.formState.errors.password}
            />

            <FormField<ResearchFormValues>
              id="confirmPassword"
              type="password"
              register={researchForm.register}
              error={researchForm.formState.errors.confirmPassword}
            />
            

            <LoadingButton type="submit" loading={isSubmitting}>
              {t("patients.registerButton")}
            </LoadingButton>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}