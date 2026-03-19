import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import {
  fetchAllGlobalMedications,
  addMedicationToClinic,
} from "@/api/medicationService";
import type { IMedication } from "@/common/types/Medication";

export function useAddToClinicDialog() {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clinicId = useAuthStore((s) => s.clinicId) ?? "";
  const queryClient = useQueryClient();

  const { data: globalMeds = [], isLoading } = useQuery({
    queryKey: ["medications", "global"],
    queryFn: fetchAllGlobalMedications,
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });

  const filteredGlobal = globalMeds.filter((m: IMedication) =>
    m.medName.toLowerCase().includes(localSearch.toLowerCase()),
  );

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClose = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSelected(new Set());
      setLocalSearch("");
    }
  };

  const handleLocalSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  };

  const onConfirm = async () => {
    setIsSubmitting(true);
    try {
      await Promise.all(
        [...selected].map((medId) => addMedicationToClinic(clinicId, medId)),
      );
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      handleClose(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    open,
    handleClose,
    localSearch,
    handleLocalSearchChange,
    filteredGlobal,
    selected,
    toggleSelect,
    isSubmitting,
    isLoading,
    onConfirm,
  };
}
