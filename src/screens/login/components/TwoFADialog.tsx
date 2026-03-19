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
}

export function TwoFADialog({ open, code, isPending, onChange, onSubmit }: TwoFADialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("login.twoFaTitle")}</DialogTitle>
          <DialogDescription>{t("login.twoFaDesc")}</DialogDescription>
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
            {isPending ? t("login.verifying") : t("login.confirm")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
