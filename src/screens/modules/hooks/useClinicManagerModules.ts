import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import { useAllModulesQuery } from "@/hooks/queries/useAllModulesQuery";
import { addClinicModule, removeClinicModule } from "@/api/modulesApi";
import { useAuthStore } from "@/store/useAuthStore";
import type { IModule } from "@/common/types/patientDetails";

export function useClinicManagerModules() {
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);
  const queryClient = useQueryClient();

  const { data: clinicModules = [], isLoading, error } = useModulesQuery(clinicId);
  const { data: allModules = [] } = useAllModulesQuery();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<IModule | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["clinic-modules", clinicId] });

  const addMutation = useMutation({
    mutationFn: (moduleId: number) => addClinicModule(clinicId!, moduleId),
  });
  const removeMutation = useMutation({
    mutationFn: (moduleId: number) => removeClinicModule(clinicId!, moduleId),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const filteredModules = clinicModules.filter((m) =>
    m.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openAddDialog = () => {
    setSelectedIds(new Set(clinicModules.map((m) => m.id)));
    setIsAddDialogOpen(true);
  };

  const closeAddDialog = () => setIsAddDialogOpen(false);

  const toggleModuleId = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!clinicId) return;
    const originalIds = new Set(clinicModules.map((m) => m.id));
    const toAdd = [...selectedIds].filter((id) => !originalIds.has(id));
    const toRemove = [...originalIds].filter((id) => !selectedIds.has(id));
    try {
      await Promise.all([
        ...toAdd.map((id) => addMutation.mutateAsync(id)),
        ...toRemove.map((id) => removeMutation.mutateAsync(id)),
      ]);
      await invalidate();
      closeAddDialog();
    } catch {
      toast.error(t("modules.saveError"));
    }
  };

  const openDelete = (module: IModule) => setModuleToDelete(module);
  const closeDelete = () => setModuleToDelete(null);

  const handleDelete = async () => {
    if (!moduleToDelete || !clinicId) return;
    try {
      await removeMutation.mutateAsync(moduleToDelete.id);
      await invalidate();
      closeDelete();
    } catch {
      toast.error(t("modules.deleteError"));
    }
  };

  const isSaving = addMutation.isPending || removeMutation.isPending;
  const isDeleting = removeMutation.isPending;

  return {
    clinicModules,
    filteredModules,
    allModules,
    isLoading,
    error: error as Error | null,
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
  };
}
