import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { selectClinic } from "@/api/authApi";
import { sanitizeUser } from "@/common/types/User";
import { ROLE_HOME_PATH } from "@/common/types/Role";

export function useClinicSwitcher() {
  const { clinicId, clinics, userId, setAuthUser } = useAuthStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  const otherClinics = clinics.filter((c) => c.id !== clinicId);

  const switchClinic = async (newClinicId: string) => {
    if (!userId || newClinicId === clinicId) return;
    setIsSwitching(true);
    try {
      const res = await selectClinic({ user_id: userId, clinic_id: newClinicId });
      const safe = sanitizeUser(res.data.user, newClinicId);
      setAuthUser(safe);
      queryClient.resetQueries({
        predicate: (query) => query.queryKey[0] !== "me",
      });
      navigate(ROLE_HOME_PATH[safe.role], { replace: true });
    } finally {
      setIsSwitching(false);
    }
  };

  return { clinics, otherClinics, isSwitching, switchClinic };
}
