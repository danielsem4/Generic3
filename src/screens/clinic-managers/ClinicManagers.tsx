import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useClinicManagers } from "./hooks/useClinicManagers";
import { useClinicManagerActions } from "./hooks/useClinicManagerActions";
import { AddClinicDialog } from "./components/AddClinicDialog";
import { ClinicManagersTable } from "./components/ClinicManagersTable";
import { EditClinicManagerDialog } from "./components/EditClinicManagerDialog";
import { ClinicSelectDialog } from "./components/ClinicSelectDialog";

export default function ClinicManagers() {
  const { t } = useTranslation();
  const { filteredUsers, searchTerm, handleSearchChange, isLoading } = useClinicManagers();
  const {
    form,
    isFormOpen,
    managerToEdit,
    managerToDelete,
    managerForClinicSelect,
    isClinicSelectOpen,
    isSubmitting,
    isDeleting,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    handleView,
    handleClinicSelect,
    closeClinicSelect,
    handleSubmit,
    handleDelete,
  } = useClinicManagerActions();

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
              {t("nav.clinicManagers")}
            </h1>
            <p className="text-muted-foreground">
              {t("clinicManagers.description")}
            </p>
          </div>
          <AddClinicDialog />
        </div>

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t("clinicManagers.searchPlaceholder")}
            className="w-full pl-12 h-14 bg-card border-border shadow-sm text-lg focus:ring-primary"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Card className="shadow-md border-none ring-1 ring-border bg-card">
          <CardHeader className="border-b border-border p-6">
            <CardTitle className="text-lg font-semibold text-foreground">
              {t("nav.clinicManagers")} ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ClinicManagersTable
              managers={filteredUsers}
              onView={handleView}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          </CardContent>
        </Card>
      </div>

      <EditClinicManagerDialog
        isOpen={isFormOpen}
        managerToEdit={managerToEdit}
        form={form}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!managerToDelete}
        onOpenChange={(open) => { if (!open) closeDelete(); }}
        title={t("clinicManagers.deleteTitle")}
        description={t("clinicManagers.deleteDescription", {
          name: `${managerToDelete?.first_name} ${managerToDelete?.last_name}`,
        })}
        confirmLabel={t("clinicManagers.deleteTitle")}
        cancelLabel={t("clinicManagers.cancel")}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />

      <ClinicSelectDialog
        isOpen={isClinicSelectOpen}
        manager={managerForClinicSelect}
        onSelect={handleClinicSelect}
        onClose={closeClinicSelect}
      />
    </div>
  );
}
