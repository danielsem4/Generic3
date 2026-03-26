import { useTranslation } from "react-i18next";
import { PlusCircle, Loader2 } from "lucide-react";
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
import { useAdminModules } from "../hooks/useAdminModules";
import { AdminModuleCard } from "./AdminModuleCard";
import { ModuleFormDialog } from "./ModuleFormDialog";

export function AdminModulesView() {
  const { t } = useTranslation();
  const {
    modules,
    isLoading,
    error,
    form,
    isFormOpen,
    moduleToEdit,
    moduleToDelete,
    isSubmitting,
    isDeleting,
    openCreate,
    openEdit,
    closeForm,
    openDelete,
    closeDelete,
    handleSubmit,
    handleDelete,
  } = useAdminModules();

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
      <div className="flex items-center justify-between">
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

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {modules.map((module) => (
          <AdminModuleCard
            key={module.id}
            module={module}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        ))}
      </div>

      <ModuleFormDialog
        isOpen={isFormOpen}
        moduleToEdit={moduleToEdit}
        form={form}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!moduleToDelete} onOpenChange={(open) => { if (!open) closeDelete(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("modules.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("modules.deleteDescription", { name: moduleToDelete?.module_name })}
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
                t("modules.deleteTitle")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
