import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { verify2FA } from "@/api/authApi";
import { useRequestPasswordReset, useResetPassword } from "./useForgotPassword";
import {
  newPasswordSchema,
  type NewPasswordFormValues,
} from "../schema/forgotPasswordSchema";

type ForgotPasswordStep = "email" | "two_fa" | "new_password";

export function useForgotPasswordLogic() {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const requestReset = useRequestPasswordReset();
  const resetPasswordMutation = useResetPassword();

  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isCodePending, setIsCodePending] = useState(false);

  const isAlreadyLoggedIn = Boolean(userId);

  const passwordForm = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      const { user_id } = await requestReset.mutateAsync({ email });
      setPendingUserId(user_id);
      setStep("two_fa");
    } catch {
      setFormError(t("forgotPassword.errorEmailFailed"));
      toast.error(t("forgotPassword.errorEmailFailed"));
    }
  };

  const handleCodeSubmit = async () => {
    setIsCodePending(true);
    try {
      await verify2FA({ user_id: pendingUserId, code });
      setStep("new_password");
    } catch {
      toast.error(t("login.failedTitle"));
    } finally {
      setIsCodePending(false);
    }
  };

  const handleCodeCancel = () => {
    setStep("email");
    setCode("");
    setPendingUserId("");
  };

  const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    try {
      await resetPasswordMutation.mutateAsync({
        user_id: pendingUserId,
        new_password: values.password,
      });
      toast.success(t("forgotPassword.successTitle"), {
        description: t("forgotPassword.successDesc"),
        duration: 2000,
      });
      navigate("/");
    } catch {
      toast.error(t("forgotPassword.errorResetFailed"));
    }
  });

  return {
    step,
    email,
    code,
    setCode,
    showPassword,
    formError,
    isAlreadyLoggedIn,
    isEmailPending: requestReset.isPending,
    isCodePending,
    isResetPending: resetPasswordMutation.isPending,
    passwordForm,
    t,
    handleEmailChange,
    handleTogglePassword,
    handleBackToLogin,
    handleEmailSubmit,
    handleCodeSubmit,
    handleCodeCancel,
    handlePasswordSubmit,
  };
}
