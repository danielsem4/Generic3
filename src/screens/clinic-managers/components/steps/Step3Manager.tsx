import { useTranslation } from "react-i18next";
import type { FieldError, UseFormRegister, UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ClinicFormValues } from "../../Schema/clinicSchema";
import { ClinicManagerSelectCard } from "./ClinicManagerSelectCard";
import { useSelectableManagers } from "../../hooks/useSelectableManagers";

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
  const { t } = useTranslation();
  const { register, formState: { errors }, watch, setValue } = form;
  const mode = watch("managerMode");
  const selectedManagerId = watch("selectedManagerId");
  const { managers, isLoading } = useSelectableManagers();

  return (
    <div className="space-y-4">
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => setValue("managerMode", "create")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            mode === "create"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground hover:bg-muted",
          )}
        >
          {t("clinicManagers.createNew")}
        </button>
        <button
          type="button"
          onClick={() => setValue("managerMode", "existing")}
          className={cn(
            "flex-1 py-2 text-sm font-medium transition-colors",
            mode === "existing"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-foreground hover:bg-muted",
          )}
        >
          {t("clinicManagers.selectExisting")}
        </button>
      </div>

      {mode === "create" && (
        <>
          <div className="flex gap-4">
            <FormField id="managerFirstName" register={register} error={errors.managerFirstName} />
            <FormField id="managerLastName" register={register} error={errors.managerLastName} />
          </div>
          <FormField id="managerEmail" type="email" register={register} error={errors.managerEmail} />
          <FormField id="managerPhone" type="tel" register={register} error={errors.managerPhone} />
        </>
      )}

      {mode === "existing" && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : managers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t("clinicManagers.noManagers")}
            </p>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {managers.map((manager) => (
                <ClinicManagerSelectCard
                  key={manager.id}
                  manager={manager}
                  selected={selectedManagerId === manager.id}
                  onSelect={() => setValue("selectedManagerId", manager.id)}
                />
              ))}
            </div>
          )}
          {errors.selectedManagerId && (
            <p className="text-[10px] text-destructive font-medium leading-none">
              {t(errors.selectedManagerId.message as string)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
