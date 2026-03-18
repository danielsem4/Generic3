import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { sanitizeUser } from "@/common/types/User";
import { ROLE_HOME_PATH } from "@/common/types/Role";
import { verify2FA } from "@/api/authApi";

export function useVerifyCode() {
  const { setAuthUser } = useAuthStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);

  const userId: string = state?.userId ?? "";

  const handleConfirm = async () => {
    if (code.length !== 6 || !userId) return;
    setIsPending(true);
    try {
      const res = await verify2FA({ user_id: userId, code });
      const response = res.data;

      if ("requires_clinic_selection" in response) {
        navigate("/clinic-selection", {
          state: { userId: response.user_id, clinics: response.clinics },
        });
        return;
      }

      if ("user" in response) {
        const safe = sanitizeUser(response.user);
        setAuthUser(safe);
        toast.success(t("login.successTitle"), { duration: 2000 });
        navigate(ROLE_HOME_PATH[safe.role]);
      }
    } catch {
      toast.error(t("login.failedTitle"));
    } finally {
      setIsPending(false);
    }
  };

  return { code, setCode, isPending, handleConfirm };
}
