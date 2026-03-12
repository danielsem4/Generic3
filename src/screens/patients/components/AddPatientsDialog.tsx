import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { UserPlus } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { patientsSchema, type PatientsFormValues } from "../Schema/patientsSchema";
import { useAddPatient } from "../hooks/useAddPatient";

export function AddPatientsDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { addPatient, isSubmitting } = useAddPatient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PatientsFormValues>({
    resolver: zodResolver(patientsSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: PatientsFormValues) => {
    await addPatient(data);
    reset();
    setOpen(false);
  };

  const renderField = (id: keyof PatientsFormValues, type = "text") => (
    <div key={id} className="space-y-1.5 flex-1 text-right">
      <label className="text-sm font-bold text-foreground flex items-center gap-1">
         {t(`patients.${id}Label`)}
         <span className="text-destructive">*</span>
      </label>

      <Input
        {...register(id)}
        type={type}
        placeholder={t(`patients.${id}Placeholder`)}
        className={errors[id]
          ? "border-destructive focus-visible:ring-destructive"
          : "border-border bg-background focus-visible:ring-primary"
        }
      />

      {errors[id] && (
        <p className="text-[10px] text-destructive font-medium leading-none">
          {t(errors[id]?.message as string)}
        </p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="flex gap-4">
            {renderField("firstName")}
            {renderField("lastName")}
          </div>

          {/* Middle fields */}
          <div className="space-y-4">
            {renderField("email", "email")}
            {renderField("phoneNumber", "tel")}
          </div>

          {/* Password fields */}
          <div className="flex gap-4">
            {renderField("password", "password")}
            {renderField("confirmPassword", "password")}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-bold rounded-full mt-6 transition-colors shadow-sm"
          >
            {t("patients.registerButton")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
