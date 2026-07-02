import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useRequestPasswordReset,
  useVerifyResetCode,
  useResetPassword,
} from "./useForgotPassword";
import {
  newPasswordSchema,
  type NewPasswordFormValues,
} from "../schema/forgotPasswordSchema";

type ForgotPasswordStep = "email" | "code" | "new_password";

export function useForgotPasswordLogic() {
  const { userId } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const requestReset = useRequestPasswordReset();
  const verifyCode = useVerifyResetCode();
  const resetPasswordMutation = useResetPassword();

  const [step, setStep] = useState<ForgotPasswordStep>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
      await requestReset.mutateAsync({ email });
      setStep("code");
    } catch {
      setFormError(t("forgotPassword.errorEmailFailed"));
      toast.error(t("forgotPassword.errorEmailFailed"));
    }
  };

  const handleCodeSubmit = async () => {
    try {
      await verifyCode.mutateAsync({ email, code });
      setStep("new_password");
    } catch {
      setCode("");
      toast.error(t("forgotPassword.errorCodeInvalid"));
    }
  };

  const handleResendCode = async () => {
    try {
      await requestReset.mutateAsync({ email });
      toast.success(t("forgotPassword.resendSuccess"));
    } catch {
      toast.error(t("forgotPassword.errorEmailFailed"));
    }
  };

  const handleCodeCancel = () => {
    setStep("email");
    setCode("");
  };

  const handlePasswordSubmit = passwordForm.handleSubmit(async (values) => {
    try {
      await resetPasswordMutation.mutateAsync({
        email,
        new_password: values.password,
      });
      toast.success(t("forgotPassword.successTitle"), {
        description: t("forgotPassword.successDesc"),
        duration: 2000,
      });
      navigate("/");
    } catch (error) {
      const data = isAxiosError(error) ? error.response?.data : undefined;
      const notVerified = JSON.stringify(data ?? "").includes("Code not verified");
      if (notVerified) {
        setCode("");
        setStep("email");
        toast.error(t("forgotPassword.errorCodeNotVerified"));
      } else {
        toast.error(t("forgotPassword.errorResetFailed"));
      }
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
    isCodePending: verifyCode.isPending,
    isResetPending: resetPasswordMutation.isPending,
    passwordForm,
    t,
    handleEmailChange,
    handleTogglePassword,
    handleBackToLogin,
    handleEmailSubmit,
    handleCodeSubmit,
    handleResendCode,
    handleCodeCancel,
    handlePasswordSubmit,
  };
}
