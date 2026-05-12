import React from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="p-0.5 text-muted-foreground hover:text-destructive cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 size={15} />
    </button>
  );
};