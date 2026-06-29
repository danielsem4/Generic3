import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailStepProps {
  email: string;
  formError: string | null;
  isPending: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function EmailStep({ email, formError, isPending, onEmailChange, onSubmit }: EmailStepProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={isPending}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">{t("forgotPassword.emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("forgotPassword.emailPlaceholder")}
              value={email}
              onChange={onEmailChange}
              required
              className="rounded-full px-4"
            />
            {formError && <p className="text-sm text-destructive">{formError}</p>}
          </div>
          <Button
            type="submit"
            disabled={isPending || !email}
            className="w-full rounded-full font-bold"
          >
            {isPending ? t("forgotPassword.sending") : t("forgotPassword.sendCode")}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
