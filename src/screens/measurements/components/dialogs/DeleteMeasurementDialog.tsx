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
import type { IMeasurement } from "@/common/types/measurement";

interface DeleteMeasurementDialogProps {
  measurement: IMeasurement | null;
  onOpenChange: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteMeasurementDialog({
  measurement,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteMeasurementDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={!!measurement} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("measurements.deleteTitle")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("measurements.deleteDescription", {
              name: measurement?.name,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("measurements.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:opacity-90"
          >
            {t("measurements.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
