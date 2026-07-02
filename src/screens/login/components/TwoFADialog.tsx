import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface TwoFADialogProps {
  open: boolean;
  code: string;
  isPending: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onResend?: () => void;
  resendLabel?: string;
  isResendPending?: boolean;
}

export function TwoFADialog({
  open,
  code,
  isPending,
  onChange,
  onSubmit,
  onCancel,
  title,
  description,
  confirmLabel,
  onResend,
  resendLabel,
  isResendPending,
}: TwoFADialogProps) {
  const { t } = useTranslation();

  const handleOpenChange = (next: boolean) => {
    if (!next) onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? t("login.twoFaTitle")}</DialogTitle>
          <DialogDescription>{description ?? t("login.twoFaDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-2">
          <InputOTP maxLength={6} value={code} onChange={onChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            className="w-full rounded-full font-bold"
            disabled={code.length !== 6 || isPending}
            onClick={onSubmit}
          >
            {isPending ? t("login.verifying") : confirmLabel ?? t("login.confirm")}
          </Button>
          {onResend && (
            <Button
              type="button"
              variant="ghost"
              className="text-sm text-primary hover:text-primary/80 font-medium"
              disabled={isResendPending}
              onClick={onResend}
            >
              {resendLabel ?? t("login.confirm")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
