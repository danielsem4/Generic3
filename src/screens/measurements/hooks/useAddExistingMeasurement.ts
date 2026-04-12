import { useState } from "react";
import type { IMeasurement } from "@/common/types/measurement";

export function useAddExistingMeasurement() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Placeholder: empty array, ready for API query
  const existingMeasurements: IMeasurement[] = [];

  const filteredMeasurements = existingMeasurements.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleSelect(id: string) {
    setSelectedId(id === selectedId ? null : id);
  }

  function handleAdd(onAdd: (measurement: IMeasurement) => void) {
    const measurement = existingMeasurements.find((m) => m.id === selectedId);
    if (measurement) {
      onAdd(measurement);
      setIsOpen(false);
      setSearchTerm("");
      setSelectedId(null);
    }
  }

  function handleClose(open: boolean) {
    setIsOpen(open);
    if (!open) {
      setSearchTerm("");
      setSelectedId(null);
    }
  }

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    handleSearchChange,
    filteredMeasurements,
    selectedId,
    handleSelect,
    handleAdd,
    handleClose,
  };
}
