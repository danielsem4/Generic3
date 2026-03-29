import { useTranslation } from "react-i18next";
import { Building2, Loader2 } from "lucide-react";
import { useClinicOverview } from "./hooks/useClinicOverview";
import { useEditClinic } from "./hooks/useEditClinic";
import { useDeleteClinic } from "./hooks/useDeleteClinic";
import { ClinicInfoCard } from "./components/ClinicInfoCard";
import { ManagerCard } from "./components/ManagerCard";
import { ModuleGrid } from "./components/ModuleGrid";
import { EditClinicDialog } from "./components/EditClinicDialog";
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

export default function ClinicOverview() {
  const { t } = useTranslation();
  const { clinic, isLoading, isManager, isAdmin, effectiveClinicId } = useClinicOverview();
  const {
    form,
    isEditOpen,
    isSubmitting,
    clinicManagers,
    openEdit,
    closeEdit,
    handleSubmit,
  } = useEditClinic(effectiveClinicId);
  const {
    isDeleteOpen,
    isDeleting,
    openDelete,
    closeDelete,
    handleDelete,
  } = useDeleteClinic(effectiveClinicId);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!clinic) return (
    <div className="p-10 text-center font-bold text-muted-foreground">
      {t("clinic.noData")}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 text-left" dir="ltr">

      <div className="mb-10 space-y-1">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl text-primary shadow-sm">
            <Building2 size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
            {t("clinic.Title")}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground font-medium ps-13">
          {t("clinic.readOnlyView")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ClinicInfoCard
          clinic={clinic}
          isManager={isManager}
          isAdmin={isAdmin}
          onEdit={() => openEdit(clinic)}
          onDelete={openDelete}
        />
        <ManagerCard manager={clinic.clinic_manager} />
      </div>

      <ModuleGrid modules={clinic.modules} />

      <EditClinicDialog
        isOpen={isEditOpen}
        form={form}
        isSubmitting={isSubmitting}
        clinicManagers={clinicManagers}
        onClose={closeEdit}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={(open) => { if (!open) closeDelete(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("clinic.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("clinic.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDelete}>
              {t("nav.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t("clinic.deleteTitle")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
