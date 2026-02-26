import React from "react";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useModules } from "./hooks/useModules";
import { ModuleCard } from "./components/ModuleCard";
import { useTranslation } from "react-i18next";

export default function Modules() {
    const { t } = useTranslation();
    const { sidebarOpen, handleToggleSidebar, items } = useModules();
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
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ms-72" : "ms-0"}`}
      >
        <SiteHeader onToggleSidebar={handleToggleSidebar} />
        <div className="flex-1 min-h-screen bg-background overflow-auto transition-all duration-300">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">{t("modules.title")}</h1>
                <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {items.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className="block w-full rounded-2xl"
                >
                  <ModuleCard
                     item={item}
                     title={t(`modules.cards.${item.key}.title`)}
                     description={t(`modules.cards.${item.key}.description`)}
                     />
                </Link>
               ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}