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
import type { ActivityFormValues } from "../schema/activitySchema";

interface Props {
  isOpen: boolean;
  form: UseFormReturn<ActivityFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function AddActivityDialog({
  isOpen,
  form,
  isSubmitting,
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
      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground">
            {t("activities.addDialogTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("activities.activityNameLabel")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              {...register("activity_name")}
              placeholder={t("activities.activityNamePlaceholder")}
              className={fieldClass(!!errors.activity_name)}
            />
            {errors.activity_name && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.activity_name.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground flex items-center gap-1">
              {t("activities.activityDescriptionLabel")}
              <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("activity_description")}
              placeholder={t("activities.activityDescriptionPlaceholder")}
              rows={3}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 resize-none ${fieldClass(!!errors.activity_description)}`}
            />
            {errors.activity_description && (
              <p className="text-[10px] text-destructive font-medium leading-none">
                {t(errors.activity_description.message as string)}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t("activities.addBtn")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
