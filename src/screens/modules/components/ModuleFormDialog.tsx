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
import type { ModuleFormValues } from "../hooks/useAdminModules";
import type { IModule } from "@/common/types/patientDetails";

interface Props {
  isOpen: boolean;
  moduleToEdit: IModule | null;
  form: UseFormReturn<ModuleFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function ModuleFormDialog({
  isOpen,
  moduleToEdit,
  form,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  const { register, formState: { errors } } = form;
  const isEdit = !!moduleToEdit;

  const fieldClass = (hasError: boolean) =>
    hasError
      ? "border-destructive focus-visible:ring-destructive"
      : "border-border bg-background focus-visible:ring-primary";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground">
            {isEdit ? t("modules.editModule") : t("modules.addModule")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("modules.moduleNameLabel")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("module_name")}
              placeholder={t("modules.moduleNamePlaceholder")}
              className={fieldClass(!!errors.module_name)}
            />
            {errors.module_name && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.module_name.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">
              {t("modules.descriptionLabel")}
            </label>
            <textarea
              {...register("description")}
              placeholder={t("modules.descriptionPlaceholder")}
              rows={3}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("modules.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("modules.save")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
