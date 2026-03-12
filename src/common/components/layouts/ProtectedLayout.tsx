import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
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
      <AppSidebar variant="inset" open={sidebarOpen} />
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