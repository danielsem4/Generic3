import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { MeasurementType } from "@/common/types/measurement";
import type { IMeasurement } from "@/common/types/measurement";

const MEASUREMENT_TYPES = [
  { value: MeasurementType.QUESTIONNAIRES, labelKey: "measurements.types.questionnaries" },
  { value: MeasurementType.COGNITIVE_TESTS, labelKey: "measurements.types.cognitiveTests" },
  { value: MeasurementType.MODULE_QUESTIONNAIRE, labelKey: "measurements.types.moduleQuestionnaire" },
] as const;

const editMeasurementSchema = z.object({
  name: z.string().min(2, "measurements.errName"),
  type: z.nativeEnum(MeasurementType, { message: "measurements.errType" }),
  isPublic: z.boolean(),
  isActive: z.boolean(),
});

type EditMeasurementFormData = z.infer<typeof editMeasurementSchema>;

interface EditMeasurementDialogProps {
  measurement: IMeasurement | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: EditMeasurementFormData) => void;
  isUpdating?: boolean;
}

export function EditMeasurementDialog({
  measurement,
  onOpenChange,
  onConfirm,
  isUpdating,
}: EditMeasurementDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditMeasurementFormData>({
    resolver: zodResolver(editMeasurementSchema),
  });

  const selectedType = watch("type");
  const isPublic = watch("isPublic");
  const isActive = watch("isActive");

  useEffect(() => {
    if (measurement) {
      reset({
        name: measurement.name,
        type: measurement.type,
        isPublic: measurement.isPublic,
        isActive: measurement.isActive,
      });
    }
  }, [measurement, reset]);

  function handleTypeSelect(type: MeasurementType) {
    setValue("type", type, { shouldValidate: true });
  }

  function handleIsPublicChange(checked: boolean) {
    setValue("isPublic", checked);
  }

  function handleIsActiveChange(checked: boolean) {
    setValue("isActive", checked);
  }

  function onSubmit(data: EditMeasurementFormData) {
    onConfirm(data);
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  return (
    <Dialog open={!!measurement} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("measurements.editTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("measurements.nameLabel")}</Label>
            <Input
              id="edit-name"
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
            <Label>{t("measurements.typeLabel")}</Label>
            <div className="grid grid-cols-3 gap-2">
              {MEASUREMENT_TYPES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleTypeSelect(item.value)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-center text-sm font-medium transition-colors",
                    selectedType === item.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-muted bg-background text-muted-foreground hover:border-primary/50",
                  )}
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="text-sm text-destructive">
                {t(errors.type.message!)}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="edit-public">{t("measurements.isPublic")}</Label>
            <Switch checked={isPublic} onCheckedChange={handleIsPublicChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="edit-active">{t("measurements.active")}</Label>
            <Switch checked={isActive} onCheckedChange={handleIsActiveChange} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              {t("measurements.cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {t("measurements.builder.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
