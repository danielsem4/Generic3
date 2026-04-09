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
  createQuestionnaireSchema,
  type CreateQuestionnaireFormData,
} from "../Schema/questionnaireSchema";

interface CreateQuestionnaireDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateQuestionnaireFormData) => void;
}

export function CreateQuestionnaireDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateQuestionnaireDialogProps) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateQuestionnaireFormData>({
    resolver: zodResolver(createQuestionnaireSchema),
    defaultValues: { name: "", description: "" },
  });

  function onSubmit(data: CreateQuestionnaireFormData) {
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
          <DialogTitle>{t("questionnaires.createTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-name">{t("questionnaires.nameLabel")}</Label>
            <Input
              id="q-name"
              placeholder={t("questionnaires.namePlaceholder")}
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
              {t("questionnaires.descriptionLabel")}
            </Label>
            <Input
              id="q-desc"
              placeholder={t("questionnaires.descriptionPlaceholder")}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              {t("questionnaires.cancel")}
            </Button>
            <Button type="submit">{t("questionnaires.create")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
