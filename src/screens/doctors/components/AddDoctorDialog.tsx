import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";
import type { FieldError, UseFormRegister } from "react-hook-form";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddDoctorDialog } from "../hooks/useAddDoctorDialog";

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
        {t(`doctors.${id}Label`)}
        <span className="text-destructive">*</span>
      </label>
      <Input
        {...register(id as never)}
        type={type}
        placeholder={t(`doctors.${id}Placeholder`)}
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

export function AddDoctorDialog() {
  const { t } = useTranslation();
  const { open, form, isSubmitting, handleClose, onSubmit } = useAddDoctorDialog();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm transition-all">
          <UserPlus size={20} /> {t("doctors.addNew")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125 bg-card border-border p-8" dir="ltr">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-center text-foreground mb-4">
            {t("doctors.registerTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-4">
            <FormField id="firstName" register={form.register as never} error={form.formState.errors.firstName} />
            <FormField id="lastName" register={form.register as never} error={form.formState.errors.lastName} />
          </div>
          <div className="space-y-4">
            <FormField id="email" type="email" register={form.register as never} error={form.formState.errors.email} />
            <FormField id="phoneNumber" type="tel" register={form.register as never} error={form.formState.errors.phoneNumber} />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-6 transition-colors shadow-sm"
          >
            {t("doctors.registerButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
