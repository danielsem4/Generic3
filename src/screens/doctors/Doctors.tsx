import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PatientsTable } from "@/screens/patients/components/PatientsTable";
import { useDoctors } from "./hooks/useDoctors";
import { AddDoctorDialog } from "./components/AddDoctorDialog";

export default function Doctors() {
  const { t } = useTranslation();
  const { filteredUsers, searchTerm, setSearchTerm, isLoading } = useDoctors();

  if (isLoading) return (
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
              {t("nav.doctors")}
            </h1>
            <p className="text-muted-foreground">
              {t("doctors.description")}
            </p>
          </div>
          <AddDoctorDialog />
        </div>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("doctors.searchPlaceholder")}
            className="w-full pl-12 h-14 bg-card border-border shadow-sm text-lg focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="shadow-md border-none ring-1 ring-border bg-card">
          <CardHeader className="border-b border-border p-6">
            <CardTitle className="text-lg font-semibold text-foreground">
              {t("nav.doctors")} ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <PatientsTable patients={filteredUsers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
