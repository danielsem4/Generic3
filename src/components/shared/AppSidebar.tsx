import React from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Users, Database, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface AppSidebarProps {
  variant?: "inset" | "default";
  menuItems?: MenuItem[];
  open?: boolean;
}

const DISABLED_URLS = ["/patients", "/clinics", "/appointments"];

export const AppSidebar: React.FC<AppSidebarProps> = ({ variant = "inset", menuItems, open = true }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const handleNavigation = (e: React.MouseEvent, item: MenuItem) => {
    if (DISABLED_URLS.includes(item.url)) {
      e.preventDefault();
      toast(t("sidebar.comingSoon", { page: item.title }), {
        duration: 3000,
      });
    }
  };

  const defaultMenuItems: MenuItem[] = [
    { title: t("sidebar.dashboard"), url: "/home", icon: LayoutDashboard },
    { title: t("sidebar.patients"), url: "/patients", icon: Users },
    { title: t("sidebar.clinics"), url: "/clinics", icon: Database },
    { title: t("sidebar.appointments"), url: "/appointments", icon: Calendar },
    { title: t("sidebar.settings"), url: "/settings", icon: Settings },
  ];

  const items = menuItems ?? defaultMenuItems;

  return (
    <aside
      className={cn(
        "fixed top-0 h-screen z-50 flex flex-col p-4 gap-4 transition-transform duration-300",
        isRTL ? "right-0" : "left-0",
        variant === "inset" ? "w-72 bg-muted" : "w-64 bg-background",
        open ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.title}
            href={item.url}
            onClick={(e) => handleNavigation(e, item)}
            className="flex items-center gap-2 p-2 rounded hover:bg-primary/20 transition"
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </a>
        );
      })}
    </aside>
  );
};
