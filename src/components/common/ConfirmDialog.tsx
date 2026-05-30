import React, { useState } from "react";
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
import { useTranslation } from "react-i18next"; 

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: Readonly<ConfirmDialogProps>) {
  const { t } = useTranslation(); 
  
  // סטטוס טעינה פשוט וטהור - נדלק בלחיצה ולא משתחרר עד שהקומפוננטה יוצאת מהמסך
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // מונע מהדיאלוג להיסגר אוטומטית בשבריר השנייה של הלחיצה
    e.preventDefault();
    e.stopPropagation();

    // מדליק את הספינר מיד ידנית
    setIsButtonLoading(true);

    // מפעיל את פונקציית האישור של האבא (מחיקה/לוגאאוט)
    onConfirm();
  };

  const handleCancelClick = () => {
    if (isButtonLoading) return;
    onOpenChange(false);
  };

  return (
    <AlertDialog 
      open={open} 
      onOpenChange={(val) => {
        if (isButtonLoading) return; // חוסם סגירה בלחיצה בחוץ בזמן שהספינר רץ
        if (!val) handleCancelClick();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center gap-2">
          
          <AlertDialogCancel 
            disabled={isButtonLoading} 
            onClick={handleCancelClick}
          >
            {cancelLabel}
          </AlertDialogCancel>
          
          <LoadingButton
            variant="default" // 🟢 נעול על כחול תמיד! אין שום סיכוי שיהיה אדום
            onClick={handleConfirmClick} 
            loading={isButtonLoading} 
            disabled={isButtonLoading}
            loadingText={t("common.loading.buttonText", "Please wait...")}
          >
            {confirmLabel}
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}