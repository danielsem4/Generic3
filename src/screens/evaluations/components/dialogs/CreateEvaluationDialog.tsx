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
import { EvaluationType } from "@/common/types/evaluation";
import {
  createEvaluationSchema,
  type CreateEvaluationFormData,
} from "../../schema/evaluationSchema";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/LoadingButton";

const MEASUREMENT_TYPES = [
  { value: EvaluationType.QUESTIONNAIRES, labelKey: "evaluations.types.questionnaries" },
  { value: EvaluationType.COGNITIVE_TESTS, labelKey: "evaluations.types.cognitiveTests" },
  { value: EvaluationType.MODULE_QUESTIONNAIRE, labelKey: "evaluations.types.moduleQuestionnaire" },
] as const;

interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateEvaluationFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateEvaluationDialog({
  open,
  onOpenChange,
  onCreate,
  isSubmitting,
}: CreateEvaluationDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEvaluationFormData>({
    resolver: zodResolver(createEvaluationSchema),
    defaultValues: { name: "", isPublic: false },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch("type");
  const isPublic = watch("isPublic");

  function handleIsPublicChange(checked: boolean) {
    setValue("isPublic", checked);
  }

  async function onSubmit(data: CreateEvaluationFormData) {
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

  function handleTypeSelect(type: EvaluationType) {
    setValue("type", type, { shouldValidate: true });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("evaluations.createTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-name">{t("evaluations.nameLabel")}</Label>
            <Input
              id="q-name"
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
            <Label htmlFor="q-public">{t("evaluations.isPublic")}</Label>
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
              {t("evaluations.cancel")}
            </Button>
            <LoadingButton 
              type="submit" 
              loading={isSubmitting}
              loadingText={t("common.loading.creating", "Creating...")} // או מפתח תרגום רלוונטי
            >
              {t("evaluations.create")}
            </LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
