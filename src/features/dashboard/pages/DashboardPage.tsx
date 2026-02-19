import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React from "react";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Users, Database, Calendar, FileText, Eye } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const DashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const { data: users = [], isLoading, isError } = useDashboard();

  const handleUnderConstruction = (featureName: string) => {
    toast(t("home.comingSoon", { page: featureName }), {
      duration: 3000,
    });
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
        <div className="flex-1 min-h-screen p-8 bg-background overflow-auto transition-all duration-300">
          <div className="w-full flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Patients Card */}
              <div
                onClick={() => handleUnderConstruction(t("home.patients"))}
                className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3 cursor-pointer"
              >
                <Users size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.patients")}</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold">{users.length}</h2>
                </div>
              </div>

              {/* Clinics Card */}
              <div
                onClick={() => handleUnderConstruction(t("home.clinics"))}
                className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3"
              >
                <Database size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.clinics")}</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold">
                    {new Set(users.map((u) => u.clinicId)).size}
                  </h2>
                </div>
              </div>

              {/* Modules Card */}
              <div
                onClick={() => handleUnderConstruction(t("home.modules"))}
                className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3"
              >
                <FileText size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.modules")}</p>
                <h2 className="text-3xl font-bold">
                  {users.reduce((acc, user) => acc + (user.modules?.length || 0), 0)}
                </h2>
              </div>

              {/* Appointments Card */}
              <div
                onClick={() => handleUnderConstruction(t("home.appointments"))}
                className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3"
              >
                <Calendar size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.appointments")}</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-4xl font-bold">
                    {users.reduce((acc, user) => acc + (user.groups?.length || 0), 0)}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <Card className="w-full shadow-lg border-none overflow-hidden bg-card text-card-foreground mt-8">
            <CardHeader className="pb-4 border-b border-border">
              <CardDescription className="text-2xl font-bold text-foreground">
                {t("home.latestUsers")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && <p className="p-4">{t("home.loading")}</p>}
              {isError && <p className="p-4 text-red-500">{t("home.loadError")}</p>}
              <Table>
                <TableCaption>{t("home.updatedNow")}</TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">{t("home.table.email")}</TableHead>
                    <TableHead className="font-bold">{t("home.table.firstName")}</TableHead>
                    <TableHead className="font-bold">{t("home.table.lastName")}</TableHead>
                    <TableHead className="font-bold">{t("home.table.phoneNumber")}</TableHead>
                    <TableHead className="font-bold">{t("home.table.role")}</TableHead>
                    <TableHead className="font-bold text-end">{t("home.table.view")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(users) && users.length > 0 ? (
                    users.slice(0, 5).map((user) => (
                      <TableRow key={user.id ?? user.email}>
                        <TableCell className="font-medium">{user.first_name}</TableCell>
                        <TableCell className="font-medium">{user.last_name}</TableCell>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell className="font-medium">{user.phone_number ?? "—"}</TableCell>
                        <TableCell className="font-medium">{user.role}</TableCell>
                        <TableCell>
                          <div className="flex justify-end">
                            <button
                              onClick={() => {}}
                              className="inline-flex items-center justify-center rounded-md border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition"
                              aria-label={t("home.table.view")}
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                        {t("home.noData")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 pt-4">
              <p className="text-xs text-muted-foreground">
                {t("home.showing", {
                  shown: Array.isArray(users) ? users.length : 0,
                  total: Array.isArray(users) ? users.length : 0,
                })}
              </p>
            </CardFooter>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
