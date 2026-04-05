import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlusCircle, Loader2 } from "lucide-react";
import type { IModule } from "@/common/types/patientDetails";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useAdminModules } from "../hooks/useAdminModules";
import { ModuleFormDialog } from "./ModuleFormDialog";
import { ModulesTable } from "./ModulesTable";

export function AdminModulesView() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    filteredModules,
    isLoading,
    error,
    form,
    isFormOpen,
    moduleToEdit,
    moduleToDelete,
    isSubmitting,
    isDeleting,
    searchTerm,
    handleSearchChange,
    openCreate,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    handleSubmit,
    handleDelete,
  } = useAdminModules();

  const handleView = (module: IModule) => {
    const slug = module.module_name.toLowerCase().replace(/\s+/g, "-");
    navigate(`/modules/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{t("home.error")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold">{t("modules.adminTitle")}</h1>
          <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
        </div>
        <Button
          onClick={openCreate}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm"
        >
          <PlusCircle size={20} />
          {t("modules.addModule")}
        </Button>
      </div>

      <ModulesTable
        modules={filteredModules}
        role="ADMIN"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onView={handleView}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <ModuleFormDialog
        isOpen={isFormOpen}
        moduleToEdit={moduleToEdit}
        form={form}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!moduleToDelete}
        onOpenChange={(open) => { if (!open) closeDelete(); }}
        title={t("modules.deleteTitle")}
        description={t("modules.deleteDescription", { name: moduleToDelete?.module_name })}
        confirmLabel={t("modules.deleteTitle")}
        cancelLabel={t("modules.cancel")}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        variant="destructive"
      />
    </div>
  );
}
