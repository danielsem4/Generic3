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
import { AppSidebar } from "@/components/ui/AppSidebar";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Users, Database, Pill, FileText, Eye } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUsersQuery } from "@/hooks/queries/useUsersQuery";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import type { IUser } from "@/common/Users";
import { useTranslation } from "react-i18next";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { clinicId, userId } = useAuthStore();
  const { t } = useTranslation();

  const isAuthenticated = !!clinicId && !!userId;

  const usersQuery = useUsersQuery(clinicId, userId);
  const modulesQuery = useModulesQuery(isAuthenticated);

  const users = usersQuery.data ?? [];
  const modules = modulesQuery.data ?? [];

  const isLoading = usersQuery.isLoading || modulesQuery.isLoading;
  const error = usersQuery.error || modulesQuery.error;

  if (isLoading) return <div>{t("home.loading")}</div>;
  if (error) return <div>{t("home.error")}</div>;

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
          <div className="w-full flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Patients Card */}
              <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
                <Users size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.patients")}</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold">{users.length}</h2>
                </div>
              </div>

              {/* Clinics Card */}
              <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
                <Database size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.clinics")}</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-3xl font-bold">1</h2>
                </div>
              </div>

              {/* Modules Card */}
              <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
                <FileText size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.modules")}</p>
                <h2 className="text-3xl font-bold">{modules.length}</h2>
              </div>

              {/* Medications Card */}
              <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
                <Pill size={24} />
                <p className="text-sm font-medium opacity-80">{t("home.medications")}</p>
                <div className="flex justify-between items-end">
                  <h2 className="text-4xl font-bold">0</h2>
                </div>
              </div>
            </div>
          </div>
          <Card className="w-full shadow-lg border-none overflow-hidden bg-card text-card-foreground">
            <CardHeader className="pb-4 border-b border-border">
              <CardDescription className="text-2xl font-bold text-foreground">
                {t("home.latestUsers")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableCaption>{t("home.updatedNow")}</TableCaption>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-bold">{t("home.firstName")}</TableHead>
                    <TableHead className="font-bold">{t("home.lastName")}</TableHead>
                    <TableHead className="font-bold">{t("home.email")}</TableHead>
                    <TableHead className="font-bold">{t("home.phone")}</TableHead>
                    <TableHead className="font-bold">{t("home.role")}</TableHead>
                    <TableHead className="font-bold text-end">{t("home.view")}</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.length > 0 ? (
                    users.slice(0, 10).map((user: IUser, index: number) => (
                      <TableRow key={user.id || index}>
                        <TableCell className="font-medium">
                          {user.first_name}
                        </TableCell>
                        <TableCell className="font-medium">
                          {user.last_name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone_number ?? "—"}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <button
                            className="inline-flex items-center justify-center rounded-md border border-border p-2
                 text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label={t("home.viewPatient")}
                          >
                            <Eye size={16} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                      >
                        {t("home.noData")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/20 pt-4">
              <p className="text-xs text-muted-foreground">
                {t("home.showing", { count: Math.min(users.length, 10), total: users.length })}
              </p>
            </CardFooter>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
