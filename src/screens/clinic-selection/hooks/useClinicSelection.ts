import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { sanitizeUser } from "@/common/types/User";
import { ROLE_HOME_PATH } from "@/common/types/Role";
import { selectClinic, type IClinicOption } from "@/api/authApi";

export function useClinicSelection() {
  const { setAuthUser } = useAuthStore();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const [isPending, setIsPending] = useState(false);

  const userId: string = state?.userId ?? "";
  const clinics: IClinicOption[] = state?.clinics ?? [];

  const handleSelect = async (clinicId: string) => {
    setIsPending(true);
    try {
      const res = await selectClinic({ user_id: userId, clinic_id: clinicId });
      const safe = sanitizeUser(res.data.user, clinicId);
      setAuthUser(safe);
      toast.success(t("login.successTitle"), { duration: 2000 });
      navigate(ROLE_HOME_PATH[safe.role]);
    } catch {
      toast.error(t("login.failedTitle"));
    } finally {
      setIsPending(false);
    }
  };

  return { clinics, isPending, handleSelect };
}
