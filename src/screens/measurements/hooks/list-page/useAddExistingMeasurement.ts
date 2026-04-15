import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { IMeasurement } from "@/common/types/measurement";
import { usePublicMeasurementsQuery } from "../queries/usePublicMeasurementsQuery";
import { useAdoptMeasurement } from "../queries/useAdoptMeasurement";

export function useAddExistingMeasurement(
  clinicMeasurements: IMeasurement[],
) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showAdopted, setShowAdopted] = useState(false);

  const { data: publicMeasurements = [], isLoading: isLoadingPublic } =
    usePublicMeasurementsQuery();
  const { adoptMeasurement, isAdopting } = useAdoptMeasurement();

  const clinicIds = new Set(clinicMeasurements.map((m) => m.id));

  const availableMeasurements = showAdopted
    ? publicMeasurements
    : publicMeasurements.filter((m) => !clinicIds.has(m.id));

  const filteredMeasurements = availableMeasurements.filter((m) =>
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
    setSelectedIds(new Set(filteredMeasurements.map((m) => m.id)));
  }

  function handleDeselectAll() {
    setSelectedIds(new Set());
  }

  async function handleAdopt(): Promise<boolean> {
    if (selectedIds.size === 0) return false;

    const selected = filteredMeasurements.filter((m) => selectedIds.has(m.id));
    const errors: string[] = [];

    for (const m of selected) {
      try {
        await adoptMeasurement({
          measurementId: m.id,
        });
      } catch {
        errors.push(m.id);
      }
    }

    if (errors.length === selected.length) {
      toast.error(t("measurements.adoptError"));
      return false;
    }

    if (errors.length > 0) {
      toast.error(t("measurements.adoptPartialError"));
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
    filteredMeasurements.length > 0 &&
    filteredMeasurements.every((m) => selectedIds.has(m.id));

  return {
    searchTerm,
    handleSearchChange,
    filteredMeasurements,
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
