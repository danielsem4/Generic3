import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { ClinicFormValues } from "../../Schema/clinicSchema";

interface Props {
  form: UseFormReturn<ClinicFormValues>;
}

export function Step1BasicInfo({ form }: Props) {
  const { t } = useTranslation();
  const { register, watch, setValue, formState: { errors } } = form;
  const clinicType = watch("clinicType");

  const fieldClass = (hasError: boolean) =>
    hasError
      ? "border-destructive focus-visible:ring-destructive"
      : "border-border bg-background focus-visible:ring-primary";

  return (
    <div className="space-y-4">
      {/* Clinic Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground flex items-center gap-1">
          {t("clinicManagers.clinicNameLabel")}
          <span className="text-destructive">*</span>
        </label>
        <Input
          {...register("clinicName")}
          placeholder={t("clinicManagers.clinicNamePlaceholder")}
          className={fieldClass(!!errors.clinicName)}
        />
        {errors.clinicName && (
          <p className="text-[10px] text-destructive font-medium leading-none">
            {t(errors.clinicName.message as string)}
          </p>
        )}
      </div>

      {/* Clinic URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground flex items-center gap-1">
          {t("clinicManagers.clinicUrlLabel")}
          <span className="text-destructive">*</span>
        </label>
        <Input
          {...register("clinicUrl")}
          type="url"
          placeholder={t("clinicManagers.clinicUrlPlaceholder")}
          className={fieldClass(!!errors.clinicUrl)}
        />
        {errors.clinicUrl && (
          <p className="text-[10px] text-destructive font-medium leading-none">
            {t(errors.clinicUrl.message as string)}
          </p>
        )}
      </div>

      {/* Clinic Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground">
          {t("clinicManagers.clinicTypeLabel")}
        </label>
        <div className="flex rounded-lg border border-border overflow-hidden">
          {(["STANDARD", "RESEARCH"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setValue("clinicType", type)}
              className={cn(
                "flex-1 py-2.5 text-sm font-semibold transition-colors",
                clinicType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted",
              )}
            >
              {t(`clinicManagers.type${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Clinic Image URL */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-foreground">
          {t("clinicManagers.clinicImageUrlLabel")}
        </label>
        <Input
          {...register("clinicImageUrl")}
          type="url"
          placeholder={t("clinicManagers.clinicImageUrlPlaceholder")}
          className={fieldClass(!!errors.clinicImageUrl)}
        />
        {errors.clinicImageUrl && (
          <p className="text-[10px] text-destructive font-medium leading-none">
            {t(errors.clinicImageUrl.message as string)}
          </p>
        )}
      </div>
    </div>
  );
}
