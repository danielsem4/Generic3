import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { IEvaluation } from "@/common/types/evaluation";
import { usePublicEvaluationsQuery } from "../queries/usePublicEvaluationsQuery";
import { useAdoptEvaluation } from "../queries/useAdoptEvaluation";

export function useAddExistingEvaluation(
  clinicEvaluations: IEvaluation[],
) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAdopted, setShowAdopted] = useState(false);

  const { data: publicEvaluations = [], isLoading: isLoadingPublic } =
    usePublicEvaluationsQuery();
  const { adoptEvaluation, isAdopting } = useAdoptEvaluation();

  const clinicIds = new Set(clinicEvaluations.map((m) => m.id));

  const availableEvaluations = showAdopted
    ? publicEvaluations
    : publicEvaluations.filter((m) => !clinicIds.has(m.id));

  const filteredEvaluations = availableEvaluations.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleToggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleSelectAll() {
    setSelectedIds(new Set(filteredEvaluations.map((m) => m.id)));
  }

  function handleDeselectAll() {
    setSelectedIds(new Set());
  }

  async function handleAdopt(): Promise<boolean> {
    if (selectedIds.size === 0) return false;

    const selected = filteredEvaluations.filter((m) => selectedIds.has(m.id));
    const errors: string[] = [];

    for (const m of selected) {
      try {
        await adoptEvaluation({
          evaluationId: m.id,
        });
      } catch {
        errors.push(m.id);
      }
    }

    if (errors.length === selected.length) {
      toast.error(t("evaluations.adoptError"));
      return false;
    }

    if (errors.length > 0) {
      toast.error(t("evaluations.adoptPartialError"));
      return false;
    }

    return true;
  }

  function handleToggleShowAdopted() {
    setShowAdopted((prev) => !prev);
  }

  function handleClose() {
    setSearchTerm("");
    setSelectedIds(new Set());
    setShowAdopted(false);
  }

  const allSelected =
    filteredEvaluations.length > 0 &&
    filteredEvaluations.every((m) => selectedIds.has(m.id));

  return {
    searchTerm,
    handleSearchChange,
    filteredEvaluations,
    selectedIds,
    handleToggle,
    handleSelectAll,
    handleDeselectAll,
    allSelected,
    handleAdopt,
    handleClose,
    isLoadingPublic,
    isAdopting,
    showAdopted,
    handleToggleShowAdopted,
    clinicIds,
  };
}
