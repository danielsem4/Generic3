import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { IQuestionnaire } from "@/common/types/questionnaire";

interface DeleteQuestionnaireDialogProps {
  questionnaire: IQuestionnaire | null;
  onOpenChange: () => void;
  onConfirm: () => void;
}

export function DeleteQuestionnaireDialog({
  questionnaire,
  onOpenChange,
  onConfirm,
}: DeleteQuestionnaireDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={!!questionnaire} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("questionnaires.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("questionnaires.deleteDescription", {
              name: questionnaire?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("questionnaires.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:opacity-90"
          >
            {t("questionnaires.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
