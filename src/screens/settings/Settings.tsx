import React from "react";
import { useTranslation } from "react-i18next";
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguageStore } from "@/store/useLanguageStore";

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
] as const;

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

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
        <SiteHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="flex-1 min-h-screen p-8 bg-background overflow-auto transition-all duration-300">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language")}</CardTitle>
                <CardDescription>{t("settings.languageDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as "en" | "he" | "ru" | "ar")}
                  className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
