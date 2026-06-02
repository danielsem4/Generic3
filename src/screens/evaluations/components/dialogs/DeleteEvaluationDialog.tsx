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
import type { IEvaluation } from "@/common/types/evaluation";

interface DeleteEvaluationDialogProps {
  evaluation: IEvaluation | null;
  onOpenChange: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteEvaluationDialog({
  evaluation,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteEvaluationDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={!!evaluation} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("evaluations.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("evaluations.deleteDescription", {
              name: evaluation?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("evaluations.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:opacity-90"
          >
            {t("evaluations.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
