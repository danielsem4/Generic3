import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import type { ClinicEditFormValues } from "../hooks/useEditClinic";
import type { IUser } from "@/common/Users";

interface Props {
  isOpen: boolean;
  form: UseFormReturn<ClinicEditFormValues>;
  isSubmitting: boolean;
  clinicManagers: IUser[];
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function EditClinicDialog({
  isOpen,
  form,
  isSubmitting,
  clinicManagers,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const { register, formState: { errors } } = form;

  const fieldClass = (hasError: boolean) =>
    hasError
      ? "border-destructive focus-visible:ring-destructive"
      : "border-border bg-background focus-visible:ring-primary";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground">
            {t("clinic.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("clinic.clinicNameLabel")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("clinic_name")}
              className={fieldClass(!!errors.clinic_name)}
            />
            {errors.clinic_name && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.clinic_name.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("clinic.clinicUrlLabel")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("clinic_url")}
              className={fieldClass(!!errors.clinic_url)}
            />
            {errors.clinic_url && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.clinic_url.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">
              {t("clinic.clinicImageLabel")}
            </label>
            <Input
              {...register("clinic_image_url")}
              className={fieldClass(!!errors.clinic_image_url)}
            />
            {errors.clinic_image_url && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.clinic_image_url.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">
              {t("clinic.managerLabel")}
              <span className="text-destructive"> *</span>
            </label>
            <select
              {...register("clinic_manager_id")}
              className={`w-full rounded-md border px-3 py-2 text-sm bg-background focus:outline-none focus-visible:ring-2 ${fieldClass(!!errors.clinic_manager_id)}`}
            >
              <option value="">{t("clinicManagers.noManagers")}</option>
              {clinicManagers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.first_name} {m.last_name} — {m.email}
                </option>
              ))}
            </select>
            {errors.clinic_manager_id && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.clinic_manager_id.message as string)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_research_clinic"
              {...register("is_research_clinic")}
              className="h-4 w-4 rounded border-border accent-primary"
            />
            <label htmlFor="is_research_clinic" className="text-sm font-bold text-foreground">
              {t("clinic.isResearchLabel")}
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("clinicManagers.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("clinicManagers.saveChanges")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
