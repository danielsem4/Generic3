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
import { MeasurementType } from "@/common/types/measurement";
import {
  createMeasurementSchema,
  type CreateMeasurementFormData,
} from "../Schema/measurementSchema";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const MEASUREMENT_TYPES = [
  { value: MeasurementType.QUESTIONNAIRES, labelKey: "measurements.types.questionnaries" },
  { value: MeasurementType.COGNITIVE_TESTS, labelKey: "measurements.types.cognitiveTests" },
  { value: MeasurementType.MODULE_QUESTIONNAIRE, labelKey: "measurements.types.moduleQuestionnaire" },
] as const;

interface CreateMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateMeasurementFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateMeasurementDialog({
  open,
  onOpenChange,
  onCreate,
  isSubmitting,
}: CreateMeasurementDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateMeasurementFormData>({
    resolver: zodResolver(createMeasurementSchema),
    defaultValues: { name: "", isPublic: false },
  });

  const selectedType = watch("type");
  const isPublic = watch("isPublic");

  function handleIsPublicChange(checked: boolean) {
    setValue("isPublic", checked);
  }

  async function onSubmit(data: CreateMeasurementFormData) {
    try {
      await onCreate(data);
      reset();
    } catch {
      // error handled by caller
    }
  }

  function handleClose(isOpen: boolean) {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  }

  function handleTypeSelect(type: MeasurementType) {
    setValue("type", type, { shouldValidate: true });
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
                      : "border-muted bg-background text-muted-foreground hover:border-primary/50"
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
            <Label htmlFor="q-public">{t("measurements.isPublic")}</Label>
            <Switch
              checked={isPublic}
              onCheckedChange={handleIsPublicChange}
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
            <Button type="submit" disabled={isSubmitting}>
              {t("measurements.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
