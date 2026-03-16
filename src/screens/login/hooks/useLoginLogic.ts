import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { ISafeUser } from "@/common/types/User";
import { deriveRole, ROLE_HOME_PATH } from "@/common/types/Role";
import { useLogin } from "../useLogin";

export function useLoginLogic() {
  const { setAuthUser, clinicId, userId } = useAuthStore();
  const { mutateAsync, isPending } = useLogin();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isAlreadyLoggedIn = Boolean(userId);

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
      const user: ISafeUser = await mutateAsync({ email, password });
      if (user?.id) {
        setAuthUser(user);
      } else {
        console.error("User data missing in response");
      }
      toast.success(t("login.successTitle"), {
        description: t("login.successDesc"),
        duration: 2000,
      });
      const role = deriveRole({
        isAdmin: user?.isAdmin ?? false,
        isClinicManager: user?.isClinicManager ?? false,
        isDoctor: user?.isDoctor ?? false,
        isPatient: user?.isPatient ?? false,
      });
      navigate(ROLE_HOME_PATH[role]);
    } catch {
      setFormError(t("login.errorFailed"));
      toast.error(t("login.failedTitle"), {
        description: t("login.failedDesc"),
      });
    }
  };

  return {
    email,
    password,
    showPassword,
    formError,
    isPending,
    isAlreadyLoggedIn,
    t,
    handleEmailChange,
    handlePasswordChange,
    handleTogglePassword,
    handleSubmit,
  };
}
