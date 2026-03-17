import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { ROLE_HOME_PATH } from "@/common/types/Role";
import { sanitizeUser } from "@/common/types/User";
import { verify2FA, selectClinic, type IClinicOption } from "@/api/authApi";
import { useLogin } from "../useLogin";

type LoginStep = "credentials" | "two_fa" | "clinic_selection";

export function useLoginLogic() {
  const { setAuthUser, userId } = useAuthStore();
  const { mutateAsync, isPending } = useLogin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [pendingUserId, setPendingUserId] = useState("");
  const [pendingClinics, setPendingClinics] = useState<IClinicOption[]>([]);
  const [twoFaCode, setTwoFaCode] = useState("");
  const [isTwoFaPending, setIsTwoFaPending] = useState(false);
  const [isClinicPending, setIsClinicPending] = useState(false);

  const isAlreadyLoggedIn = Boolean(userId);

  const handleSuccess = (user: ReturnType<typeof sanitizeUser>) => {
    setAuthUser(user);
    toast.success(t("login.successTitle"), {
      description: t("login.successDesc"),
      duration: 2000,
    });
    navigate(ROLE_HOME_PATH[user.role]);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    try {
      const response = await mutateAsync({ email, password });
      console.log({ response });

      if ("requires_2fa" in response) {
        setPendingUserId(response.user_id);
        setStep("two_fa");
        return;
      }

      if ("requires_clinic_selection" in response) {
        setPendingUserId(response.user_id);
        setPendingClinics(response.clinics);
        setStep("clinic_selection");
        return;
      }

      handleSuccess(sanitizeUser(response.user));
    } catch {
      setFormError(t("login.errorFailed"));
      toast.error(t("login.failedTitle"), {
        description: t("login.failedDesc"),
      });
    }
  };

  const handleTwoFaSubmit = async () => {
    setIsTwoFaPending(true);
    try {
      const res = await verify2FA({ user_id: pendingUserId, code: twoFaCode });
      const response = res.data;

      if ("requires_clinic_selection" in response) {
        setPendingUserId(response.user_id);
        setPendingClinics(response.clinics);
        setTwoFaCode("");
        setStep("clinic_selection");
        return;
      }

      if ("user" in response) {
        handleSuccess(sanitizeUser(response.user));
      }
    } catch {
      toast.error(t("login.failedTitle"));
    } finally {
      setIsTwoFaPending(false);
    }
  };

  const handleClinicSelect = async (clinicId: string) => {
    setIsClinicPending(true);
    try {
      const res = await selectClinic({
        user_id: pendingUserId,
        clinic_id: clinicId,
      });
      handleSuccess(sanitizeUser(res.data.user, clinicId));
    } catch {
      toast.error(t("login.failedTitle"));
    } finally {
      setIsClinicPending(false);
    }
  };

  return {
    step,
    email,
    password,
    showPassword,
    formError,
    isPending,
    isAlreadyLoggedIn,
    twoFaCode,
    setTwoFaCode,
    isTwoFaPending,
    pendingClinics,
    isClinicPending,
    t,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleSubmit,
    handleTwoFaSubmit,
    handleClinicSelect,
  };
}
