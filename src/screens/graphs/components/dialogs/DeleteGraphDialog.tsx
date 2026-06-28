import { useTranslation } from "react-i18next";
import type { IGraph } from "@/common/types/graph";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface DeleteGraphDialogProps {
  graph: IGraph | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteGraphDialog({
  graph,
  onOpenChange,
  onConfirm,
  isDeleting,
}: DeleteGraphDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={!!graph} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("graphs.deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("graphs.deleteDescription", { name: graph?.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("graphs.cancel")}</AlertDialogCancel>
          <LoadingButton
            onClick={onConfirm}
            loading={isDeleting}
            loadingText={t("common.loading.deleting", "Deleting...")}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("graphs.delete")}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
