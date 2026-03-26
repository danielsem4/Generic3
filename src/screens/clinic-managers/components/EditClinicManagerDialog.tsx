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
import type { ManagerEditFormValues } from "../hooks/useClinicManagerActions";
import type { IUser } from "@/common/Users";

interface Props {
  isOpen: boolean;
  managerToEdit: IUser | null;
  form: UseFormReturn<ManagerEditFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function EditClinicManagerDialog({
  isOpen,
  managerToEdit,
  form,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const { register, formState: { errors } } = form;
  void managerToEdit;

  const fieldClass = (hasError: boolean) =>
    hasError
      ? "border-destructive focus-visible:ring-destructive"
      : "border-border bg-background focus-visible:ring-primary";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground">
            {t("clinicManagers.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("home.firstName")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("first_name")}
              className={fieldClass(!!errors.first_name)}
            />
            {errors.first_name && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.first_name.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("home.lastName")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("last_name")}
              className={fieldClass(!!errors.last_name)}
            />
            {errors.last_name && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.last_name.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("home.phone")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("phone_number")}
              className={fieldClass(!!errors.phone_number)}
            />
            {errors.phone_number && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.phone_number.message as string)}
              </p>
            )}
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
