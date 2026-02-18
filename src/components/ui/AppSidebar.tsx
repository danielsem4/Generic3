import React from "react";
import toast from 'react-hot-toast';
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

  const handleNavigation = (e: React.MouseEvent, item: MenuItem) => {
  const unreadyPages = ["Patients", "Clinics", "Appointments", "Settings"];

  if (unreadyPages.includes(item.title)) {
      e.preventDefault(); // עוצר את המעבר לעמוד 404
      
      // שימוש בפורמט של react-hot-toast
      toast(`The ${item.title} page is coming soon!`, {
        icon: '🚧',
        duration: 3000,
      });
    }
  };

  const defaultMenuItems: MenuItem[] = [
    { title: "Dashboard", url: "/home", icon: LayoutDashboard },
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
