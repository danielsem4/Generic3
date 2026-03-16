import {
  Users,
  Database,
  Settings,
  Building2,
  BarChart2,
  UserCog,
  Stethoscope,
  LayoutDashboard,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRole } from "./useRole";
import type { MenuItem } from "@/components/ui/AppSidebar";
import type { UserRole } from "@/common/types/Role";

type NavFactory = (t: (key: string) => string) => MenuItem[];

const NAV_ITEMS_BY_ROLE: Record<UserRole, NavFactory> = {
  admin: (t) => [
    { title: t("nav.clinicManagers"), url: "/clinic-managers", icon: Users },
    { title: t("nav.clinics"), icon: Building2 },
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.manage"), icon: UserCog },
    { title: t("nav.statistics"), icon: BarChart2 },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  clinic_manager: (t) => [
    { title: t("nav.doctors"), url: "/doctors", icon: Stethoscope },
    { title: t("nav.clinicModules"), url: "/modules", icon: Database },
    { title: t("nav.statistics"), icon: BarChart2 },
    { title: t("nav.patients"), url: "/patients", icon: Users },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  doctor: (t) => [
    { title: t("nav.patients"), url: "/patients", icon: Users },
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.statistics"), icon: BarChart2 },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  patient: (t) => [
    // { title: t("nav.dashboard"), url: "/home", icon: LayoutDashboard },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
  unknown: (t) => [
    // { title: t("nav.dashboard"), url: "/home", icon: LayoutDashboard },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ],
};

export function useRoleNavItems(): MenuItem[] {
  const { t } = useTranslation();
  const role = useRole();
  return NAV_ITEMS_BY_ROLE[role](t);
}
