import { AddPatientsDialog } from "./components/AddPatientsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import { usePatients } from "./hooks/usePatients";
import { PatientsTable } from "./components/PatientsTable";
import { useTranslation } from "react-i18next";

export default function Patients() {
  const { t } = useTranslation();
  const { filteredUsers, searchTerm, handleSearchChange, isLoading } = usePatients();

  if (isLoading)
    return (
      <div className="p-10 text-center text-muted-foreground font-medium">
        {t("home.loading")}
      </div>
    );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {t("patients.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("patients.description")}
            </p>
          </div>
          <AddPatientsDialog />
        </div>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("patients.searchPlaceholder")}
            className="w-full pl-12 h-14 bg-card border-border shadow-sm text-lg focus:ring-primary"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Card className="shadow-md border-none ring-1 ring-border bg-card">
          <CardHeader className="border-b border-border p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold text-foreground">
                {t("home.latestUsers")} ({filteredUsers.length})
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <PatientsTable patients={filteredUsers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
