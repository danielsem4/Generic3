import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const SettingsPage = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const currentLanguage = i18n.language as LanguageCode;

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value as LanguageCode;
    i18n.changeLanguage(code);
    toast.success(t("settings.language.saved"));
  };

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" open={sidebarOpen} />
      <SidebarInset
        className={cn(
          "flex-1 transition-all duration-300",
          sidebarOpen ? (isRTL ? "mr-72" : "ml-72") : (isRTL ? "mr-0" : "ml-0")
        )}
      >
        <SiteHeader onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className="flex-1 min-h-screen p-8 bg-background overflow-auto">
          <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

          <div className="flex flex-col gap-6 max-w-2xl">

            {/* Language Section */}
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language.sectionTitle")}</CardTitle>
                <CardDescription>
                  {t("settings.language.sectionDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="language-select"
                    className="text-sm font-medium text-foreground"
                  >
                    {t("settings.language.label")}
                  </label>
                  <select
                    id="language-select"
                    value={currentLanguage}
                    onChange={handleLanguageChange}
                    className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {LANGUAGES.map(({ code, label }) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Account Section */}
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.account.sectionTitle")}</CardTitle>
                <CardDescription>
                  {t("settings.account.sectionDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t("sidebar.comingSoon", { page: t("settings.account.sectionTitle") })}
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
