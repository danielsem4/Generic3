import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import { useAvailableModulesQuery } from "@/hooks/queries/useAvailableModulesQuery";
import { addClinicModule, removeClinicModule } from "@/api/modulesApi";
import { useAuthStore } from "@/store/useAuthStore";
import type { IModule } from "@/common/types/patientDetails";

export function useClinicManagerModules() {
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);
  const queryClient = useQueryClient();

  const { data: clinicModules = [], isLoading, error } = useModulesQuery(clinicId);
  const { data: availableModules = [] } = useAvailableModulesQuery(clinicId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<IModule | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["clinic-modules", clinicId] }),
      queryClient.invalidateQueries({ queryKey: ["available-modules", clinicId] }),
    ]);

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
    setSelectedIds(new Set());
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
    if (!clinicId || selectedIds.size === 0) return;
    try {
      await Promise.all(
        [...selectedIds].map((id) => addMutation.mutateAsync(id)),
      );
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
    availableModules,
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
