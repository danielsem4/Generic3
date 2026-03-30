import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { getCurrentUser } from "@/api/authApi";
import { useAuthStore } from "@/store/useAuthStore";

interface IProfileData {
  initials: string;
  fullName: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  isActive: boolean;
  is2FAEnabled: boolean;
  memberSince: string;
  currentClinicName: string;
  clinicCount: number;
}

export function useProfileData() {
  const { i18n } = useTranslation();
  const clinicName = useAuthStore((s) => s.clinicName);

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await getCurrentUser();
      return res.data;
    },
  });

  const profile: IProfileData | null = data
    ? {
        initials: `${data.first_name.charAt(0)}${data.last_name.charAt(0)}`,
        fullName: `${data.first_name} ${data.last_name}`,
        email: data.email,
        phoneNumber: data.phone_number,
        role: data.role,
        isActive: data.is_active,
        is2FAEnabled: data.is_2fa_enabled,
        memberSince: new Intl.DateTimeFormat(i18n.language, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(data.created_at)),
        currentClinicName: clinicName,
        clinicCount: data.clinics?.length ?? 0,
      }
    : null;

  return { profile, isLoading };
}
