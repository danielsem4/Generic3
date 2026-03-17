import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { selectClinic } from "@/api/authApi";
import { sanitizeUser } from "@/common/types/User";

export function useClinicSwitcher() {
  const { clinicId, clinics, userId, setAuthUser } = useAuthStore();
  const queryClient = useQueryClient();
  const [isSwitching, setIsSwitching] = useState(false);

  const otherClinics = clinics.filter((c) => c.id !== clinicId);

  const switchClinic = async (newClinicId: string) => {
    if (!userId || newClinicId === clinicId) return;
    setIsSwitching(true);
    try {
      const res = await selectClinic({ user_id: userId, clinic_id: newClinicId });
      setAuthUser(sanitizeUser(res.data.user, newClinicId));
      queryClient.resetQueries({
        predicate: (query) => query.queryKey[0] !== "me",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  return { clinics, otherClinics, isSwitching, switchClinic };
}
