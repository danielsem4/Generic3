import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  createMeasurementSchema,
  type CreateMeasurementFormData,
} from "../Schema/measurementSchema";

interface CreateMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateMeasurementFormData) => void;
}

export function CreateMeasurementDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateMeasurementDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMeasurementFormData>({
    resolver: zodResolver(createMeasurementSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(data: CreateMeasurementFormData) {
    onCreate(data);
    reset();
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("measurements.createTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-name">{t("measurements.nameLabel")}</Label>
            <Input
              id="q-name"
              placeholder={t("measurements.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {t(errors.name.message!)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-desc">
              {t("measurements.descriptionLabel")}
            </Label>
            <Input
              id="q-desc"
              placeholder={t("measurements.descriptionPlaceholder")}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              {t("measurements.cancel")}
            </Button>
            <Button type="submit">{t("measurements.create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
