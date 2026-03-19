import {
  Users,
  Database,
  Settings,
  Building2,
  BarChart2,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { MenuItem } from "@/components/ui/AppSidebar";
import type { UserRole } from "@/common/types/Role";
import { useAuthStore } from "@/store/useAuthStore";

type NavFactory = (t: (key: string) => string) => MenuItem[];

const NAV_ITEMS_BY_ROLE: Record<UserRole, NavFactory> = {
  ADMIN: (t) => [
    { title: t("nav.clinicManagers"), url: "/clinic-managers", icon: Users },
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  CLINIC_MANAGER: (t) => [
    { title: t("nav.doctors"), url: "/doctors", icon: Stethoscope },
    { title: t("nav.patients"), url: "/patients", icon: Users },
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.clinic"), icon: Building2 },
    { title: t("nav.statistics"), icon: BarChart2 },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  DOCTOR: (t) => [
    { title: t("nav.patients"), url: "/patients", icon: Users },
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.clinic"), icon: Building2 },
    { title: t("nav.statistics"), icon: BarChart2 },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  PATIENT: (t) => [
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  RESEARCH_PATIENT: (t) => [
    { title: t("nav.dashboard"), url: "/home", icon: LayoutDashboard },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
};

export function useRoleNavItems(): MenuItem[] {
  const { t } = useTranslation();
  const role = useAuthStore((s) => s.role);
  if (!role) return [];
  return NAV_ITEMS_BY_ROLE[role](t);
}
