import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAllModulesQuery } from "@/hooks/queries/useAllModulesQuery";
import { createModule, updateModule, deleteModule } from "@/api/modulesApi";
import type { IModule } from "@/common/types/patientDetails";

const moduleSchema = z.object({
  module_name: z.string().min(1, "modules.errModuleName"),
  description: z.string().optional(),
});

export type ModuleFormValues = z.infer<typeof moduleSchema>;

export function useAdminModules() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { data: modules = [], isLoading, error } = useAllModulesQuery();
  const [moduleToEdit, setModuleToEdit] = useState<IModule | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<IModule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: { module_name: "", description: "" },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["modules"] });

  const createMutation = useMutation({ mutationFn: createModule, onSuccess: invalidate });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ModuleFormValues }) => updateModule(id, data),
    onSuccess: invalidate,
  });
  const deleteMutation = useMutation({ mutationFn: deleteModule, onSuccess: invalidate });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);

  const filteredModules = modules.filter((m) =>
    m.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const openCreate = () => {
    setModuleToEdit(null);
    form.reset({ module_name: "", description: "" });
    setIsFormOpen(true);
  };

  const openEdit = (module: IModule) => {
    setModuleToEdit(module);
    form.reset({ module_name: module.module_name, description: module.description ?? "" });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    form.reset();
  };

  const openDelete = (module: IModule) => setModuleToDelete(module);
  const closeDelete = () => setModuleToDelete(null);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (moduleToEdit) {
        await updateMutation.mutateAsync({ id: moduleToEdit.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      closeForm();
    } catch {
      toast.error(t("modules.saveError"));
    }
  });

  const handleDelete = async () => {
    if (!moduleToDelete) return;
    try {
      await deleteMutation.mutateAsync(moduleToDelete.id);
      closeDelete();
    } catch {
      toast.error(t("modules.deleteError"));
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return {
    modules,
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
  };
}
