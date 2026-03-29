import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Loader2 } from "lucide-react";
import type { IModule } from "@/common/types/patientDetails";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClinicManagerModules } from "../hooks/useClinicManagerModules";
import { ModulesTable } from "./ModulesTable";
import { AddClinicModuleDialog } from "./AddClinicModuleDialog";

export function ClinicManagerModulesView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    filteredModules,
    allModules,
    isLoading,
    error,
    isAddDialogOpen,
    moduleToDelete,
    selectedIds,
    isSaving,
    isDeleting,
    searchTerm,
    handleSearchChange,
    openAddDialog,
    closeAddDialog,
    toggleModuleId,
    handleSave,
    openDelete,
    closeDelete,
    handleDelete,
  } = useClinicManagerModules();

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
          <h1 className="text-xl font-semibold">{t("modules.clinicManagerTitle")}</h1>
          <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm"
        >
          <PlusCircle size={20} />
          {t("modules.addModule")}
        </Button>
      </div>

      <ModulesTable
        modules={filteredModules}
        role="CLINIC_MANAGER"
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onDelete={openDelete}
        onView={handleView}
      />

      <AddClinicModuleDialog
        isOpen={isAddDialogOpen}
        allModules={allModules}
        selectedIds={selectedIds}
        isSaving={isSaving}
        onClose={closeAddDialog}
        onToggle={toggleModuleId}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!moduleToDelete}
        onOpenChange={(open) => { if (!open) closeDelete(); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("modules.removeClinicModuleTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("modules.removeClinicModuleDescription", { name: moduleToDelete?.module_name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDelete}>{t("modules.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("modules.removeClinicModuleTitle")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
