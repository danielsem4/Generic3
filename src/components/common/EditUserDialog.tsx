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
import type { UserEditFormValues } from "@/hooks/common/useUserActions";

interface Props {
  isOpen: boolean;
  ns: string;
  form: UseFormReturn<UserEditFormValues>;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

export function EditUserDialog({
  isOpen,
  ns,
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

  const fields = [
    { name: "first_name", label: "home.firstName" },
    { name: "last_name", label: "home.lastName" },
    { name: "email", label: "home.email" },
    { name: "phone_number", label: "home.phone" },
  ] as const;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-card border-border p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground">
            {t(`${ns}.editTitle`)}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          {fields.map((field) => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-sm font-bold text-foreground flex items-center gap-1">
                {t(field.label)}
                <span className="text-destructive">*</span>
              </label>
              <Input
                {...register(field.name)}
                className={fieldClass(!!errors[field.name])}
              />
              {errors[field.name] && (
                <p className="text-[10px] text-destructive font-medium leading-none">
                  {t(errors[field.name]?.message as string)}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t(`${ns}.cancel`)}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t(`${ns}.saveChanges`)
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
