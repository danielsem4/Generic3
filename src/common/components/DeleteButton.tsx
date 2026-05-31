import React from "react";
import { Trash2 } from "lucide-react";
import { LoadingButton } from "@/components/ui/LoadingButton";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled,
  loading = false,
}) => {
  return (
    <LoadingButton
      type="button"
      variant="ghost"
      size="icon" // 🟢 אומר ל-LoadingButton להתנהג כמו כפתור אייקון קטן ולא כמו כפתור טופס גדול
      onClick={onClick}
      disabled={disabled}
      loading={loading} // 🟢 מעביר את הסטטוס ישירות לרכיב שלכן שיפעיל את הספינר שלו
      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-md"
    >
      {/* ה-LoadingButton שלכן כבר יודע להחליף את ה-Trash2 בספינר המקורי בזמן ש-loading הוא true */}
      <Trash2 size={15} />
    </LoadingButton>
  );
};