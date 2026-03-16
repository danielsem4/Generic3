import React from "react";
import {
  // LayoutDashboard,
  Users,
  Database,
  Settings,
  LogOut,
  Pill,
} from "lucide-react";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import api from "@/lib/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface MenuItem {
  title: string;
  url?: string;
  icon: React.ElementType;
}

interface AppSidebarProps {
  variant?: "inset" | "default";
  menuItems?: MenuItem[];
  open?: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  variant = "inset",
  menuItems,
  open = true,
}) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const firstName = useAuthStore((s) => s.firstName);
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const defaultMenuItems: MenuItem[] = [
    // { title: t("nav.dashboard"), url: "/home", icon: LayoutDashboard },
    { title: t("nav.patients"), url: "/patients", icon: Users },
    { title: t("nav.modules"), url: "/modules", icon: Database },
    { title: t("nav.medications"), url: "/medications", icon: Pill },
    { title: t("nav.settings"), url: "/settings", icon: Settings },
  ];

  const items = menuItems ?? defaultMenuItems;

  const handleLogout = async () => {
    try {
      await api.delete("/api/v1/auth/sessions/");
    } catch {
      // Session may already be expired — proceed with local cleanup
    }
    logout();
    queryClient.clear();
    navigate("/");
  };

  return (
    <aside
      className={`fixed top-0 start-0 h-screen z-50 flex flex-col p-4 gap-4 transition-transform duration-300 ${
        variant === "inset" ? "w-72 bg-muted" : "w-64 bg-background"
      } ${open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}`}
    >
      {firstName && (
        <div className="px-2 pb-2 border-b border-border/50">
          <p className="text-md text-muted-foreground">
            Hello,{" "}
            <span className="font-semibold text-foreground">{firstName}</span>
          </p>
        </div>
      )}

      {items.map((item) => {
        const Icon = item.icon;

        if (!item.url) {
          return (
            <button
              key={item.title}
              type="button"
              onClick={() =>
                toast(t("nav.pageNotReady", { title: item.title }), {
                  duration: 3000,
                })
              }
              className="flex items-center gap-2 p-2 rounded hover:bg-primary/20 transition"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        }
        return (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded transition text-start w-full ${
                isActive ? "bg-primary/30 font-semibold" : "hover:bg-primary/20"
              }`
            }
          >
            <Icon size={20} />
            <span>{item.title}</span>
          </NavLink>
        );
      })}

      <div className="mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded hover:bg-destructive/20 transition text-destructive w-full text-start"
            >
              <LogOut size={20} />
              <span>{t("nav.logout")}</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("nav.logoutConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("nav.logoutConfirmDesc")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("nav.cancel")}</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                {t("nav.logoutConfirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
