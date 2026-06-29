import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NewPasswordFormValues } from "../schema/forgotPasswordSchema";

interface NewPasswordStepProps {
  form: UseFormReturn<NewPasswordFormValues>;
  showPassword: boolean;
  isPending: boolean;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function NewPasswordStep({
  form,
  showPassword,
  isPending,
  onTogglePassword,
  onSubmit,
}: NewPasswordStepProps) {
  const { t } = useTranslation();
  const { errors } = form.formState;

  return (
    <form onSubmit={onSubmit}>
      <fieldset disabled={isPending}>
        <div className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="password">{t("forgotPassword.newPasswordLabel")}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("forgotPassword.newPasswordPlaceholder")}
                {...form.register("password")}
                className="rounded-full px-4 pe-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onTogglePassword}
                className="absolute top-1/2 end-2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{t(errors.password.message as string)}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">
              {t("forgotPassword.confirmPasswordLabel")}
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder={t("forgotPassword.confirmPasswordPlaceholder")}
              {...form.register("confirmPassword")}
              className="rounded-full px-4"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {t(errors.confirmPassword.message as string)}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full font-bold"
          >
            {isPending ? t("forgotPassword.submitting") : t("forgotPassword.submit")}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
