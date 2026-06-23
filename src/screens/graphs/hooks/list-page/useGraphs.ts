import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import type { IGraph } from "@/common/types/graph";
import { useGraphsQuery } from "../queries/useGraphsQuery";
import { useDeleteGraph } from "../queries/useDeleteGraph";

export function useGraphs() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data: graphs = [], isLoading } = useGraphsQuery(clinicId);
  const { deleteGraph, isDeleting } = useDeleteGraph();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<IGraph | null>(null);

  const filteredGraphs = graphs.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleCreate() {
    navigate("/modules/graphs/builder");
  }

  function handleEdit(id: string) {
    navigate(`/modules/graphs/builder/${id}`);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteGraph(deleteTarget.id);
      toast.success(t("graphs.deleteSuccess"));
    } catch {
      toast.error(t("graphs.deleteError"));
    } finally {
      setDeleteTarget(null);
    }
  }

  return {
    graphs: filteredGraphs,
    searchTerm,
    handleSearchChange,
    handleCreate,
    handleEdit,
    deleteTarget,
    setDeleteTarget,
    handleDelete,
    isDeleting,
    isLoading,
  };
}
