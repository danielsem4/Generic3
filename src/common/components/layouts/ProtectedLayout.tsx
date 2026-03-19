import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRoleNavItems } from "@/hooks/common/useRoleNavItems";
import { useInitAuth } from "@/hooks/common/useInitAuth";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedLayout() {
  const { isLoading } = useInitAuth();
  const userId = useAuthStore((s) => s.userId);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const menuItems = useRoleNavItems();

  if (isLoading) return null;

  if (!userId) return <Navigate to="/" replace />;

  const handleToggleSidebar = () => {
    setSidebarOpen((p) => !p);
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" open={sidebarOpen} menuItems={menuItems} />
      <SidebarInset
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ms-72" : "ms-0"
        }`}
      >
        <SiteHeader onToggleSidebar={handleToggleSidebar} />
        <div className="flex-1 min-h-screen bg-background overflow-auto transition-all duration-300">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
