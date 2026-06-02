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
import { EvaluationType } from "@/common/types/evaluation";
import type { IEvaluation } from "@/common/types/evaluation";

const MEASUREMENT_TYPES = [
  { value: EvaluationType.QUESTIONNAIRES, labelKey: "evaluations.types.questionnaries" },
  { value: EvaluationType.COGNITIVE_TESTS, labelKey: "evaluations.types.cognitiveTests" },
  { value: EvaluationType.MODULE_QUESTIONNAIRE, labelKey: "evaluations.types.moduleQuestionnaire" },
  { value: EvaluationType.MEDICAL_STAFF_EVALUATION, labelKey: "evaluations.types.medicalStaffEvaluation" },
] as const;

const editEvaluationSchema = z.object({
  name: z.string().min(2, "evaluations.errName"),
  type: z.nativeEnum(EvaluationType, { message: "evaluations.errType" }),
  isPublic: z.boolean(),
  isActive: z.boolean(),
});

type EditEvaluationFormData = z.infer<typeof editEvaluationSchema>;

interface EditEvaluationDialogProps {
  evaluation: IEvaluation | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: EditEvaluationFormData) => void;
  isUpdating?: boolean;
}

export function EditEvaluationDialog({
  evaluation,
  onOpenChange,
  onConfirm,
  isUpdating,
}: EditEvaluationDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditEvaluationFormData>({
    resolver: zodResolver(editEvaluationSchema),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch("type");
  const isPublic = watch("isPublic");
  const isActive = watch("isActive");

  useEffect(() => {
    if (evaluation) {
      reset({
        name: evaluation.name,
        type: evaluation.type,
        isPublic: evaluation.isPublic,
        isActive: evaluation.isActive,
      });
    }
  }, [evaluation, reset]);

  function handleTypeSelect(type: EvaluationType) {
    setValue("type", type, { shouldValidate: true });
  }

  function handleIsPublicChange(checked: boolean) {
    setValue("isPublic", checked);
  }

  function handleIsActiveChange(checked: boolean) {
    setValue("isActive", checked);
  }

  function onSubmit(data: EditEvaluationFormData) {
    onConfirm(data);
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  return (
    <Dialog open={!!evaluation} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("evaluations.editTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">{t("evaluations.nameLabel")}</Label>
            <Input
              id="edit-name"
              placeholder={t("evaluations.namePlaceholder")}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {t(errors.name.message!)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("evaluations.typeLabel")}</Label>
            <div className="grid grid-cols-2 gap-2">
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
            <Label htmlFor="edit-public">{t("evaluations.isPublic")}</Label>
            <Switch checked={isPublic} onCheckedChange={handleIsPublicChange} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="edit-active">{t("evaluations.active")}</Label>
            <Switch checked={isActive} onCheckedChange={handleIsActiveChange} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              {t("evaluations.cancel")}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {t("evaluations.builder.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
