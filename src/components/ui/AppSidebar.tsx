import React from "react";
import { LayoutDashboard, Users, Database, Calendar, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
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

export const AppSidebar: React.FC<AppSidebarProps> = ({ variant = "inset", menuItems, open = true }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  const defaultMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/home", icon: LayoutDashboard },
    { title: "Patients", url: "/patients", icon: Users },
    { title: "Clinics", url: "/clinics", icon: Database },
    { title: "Modules", url: "/modules", icon: Database },
    { title: "Appointments", url: "/appointments", icon: Calendar },
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Reports", icon: Database }
  ];

  const items = menuItems ?? defaultMenuItems;

  const handleLogout = async () => {
    try {
      await api.post("/api/v1/auth/logout/");
    } catch {
      // Session may already be expired — proceed with local cleanup
    }
    logout();
    queryClient.clear();
    navigate("/");
  };

  return (
<aside
  className={`fixed top-0 left-0 h-screen z-50 flex flex-col p-4 gap-4 transition-transform duration-300 ${
    variant === "inset" ? "w-72 bg-muted" : "w-64 bg-background"
  } ${open ? "translate-x-0" : "-translate-x-full"}`}
>
      {items.map((item) => {
        const Icon = item.icon;

        if (!item.url) {
          return (
            <button
              key={item.title}
              type= "button"
              onClick={() => toast(`${item.title} page does not exist yet!`, { duration: 3000 })}
              className="flex items-center gap-2 p-2 rounded hover:bg-primary/20 transition"
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        }
        return (
          <button
    key={item.title}
    type="button"
    onClick={() => {
      if (item.url) navigate(item.url);
      else toast(`${item.title} page does not exist yet!`, { duration: 3000 });
    }}
    className="flex items-center gap-2 p-2 rounded hover:bg-primary/20 transition text-left w-full"
  >
    <Icon size={20} />
    <span>{item.title}</span>
  </button>
);
      })}

      <div className="mt-auto">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 p-2 rounded hover:bg-destructive/20 transition text-destructive w-full text-left"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
              <AlertDialogDescription>
                You will be signed out and redirected to the login screen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Yes, logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
