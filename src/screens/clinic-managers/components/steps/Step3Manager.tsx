import { useTranslation } from "react-i18next";
import type { FieldError, UseFormRegister, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { ClinicFormValues } from "../../Schema/clinicSchema";

interface FieldProps {
  id: keyof ClinicFormValues;
  type?: string;
  register: UseFormRegister<ClinicFormValues>;
  error?: FieldError;
}

function FormField({ id, type = "text", register, error }: FieldProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-sm font-bold text-foreground flex items-center gap-1">
        {t(`clinicManagers.manager${id.replace("manager", "")}Label`)}
        <span className="text-destructive">*</span>
      </label>
      <Input
        {...register(id)}
        type={type}
        placeholder={t(`clinicManagers.manager${id.replace("manager", "")}Placeholder`)}
        className={
          error
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

interface Props {
  form: UseFormReturn<ClinicFormValues>;
}

export function Step3Manager({ form }: Props) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <FormField id="managerFirstName" register={register} error={errors.managerFirstName} />
        <FormField id="managerLastName" register={register} error={errors.managerLastName} />
      </div>
      <FormField id="managerEmail" type="email" register={register} error={errors.managerEmail} />
      <FormField id="managerPhone" type="tel" register={register} error={errors.managerPhone} />
    </div>
  );
}
