import React from "react";
import { LayoutDashboard, Users, Database, Calendar, Settings } from "lucide-react";

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

export const AppSidebar: React.FC<AppSidebarProps> = ({ variant = "inset", menuItems, open = true }) => {
  const defaultMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Patients", url: "/patients", icon: Users },
    { title: "Clinics", url: "/clinics", icon: Database },
    { title: "Appointments", url: "/appointments", icon: Calendar },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const items = menuItems ?? defaultMenuItems;

  return (
<aside
  className={`fixed top-0 left-0 h-screen z-50 flex flex-col p-4 gap-4 transition-transform duration-300 ${
    variant === "inset" ? "w-72 bg-muted" : "w-64 bg-background"
  } ${open ? "translate-x-0" : "-translate-x-full"}`}
>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.title}
            href={item.url} 
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
