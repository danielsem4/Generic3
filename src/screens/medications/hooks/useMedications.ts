import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRole } from "@/hooks/common/useRole";
import { useAuthStore } from "@/store/useAuthStore";
import {
  removeMedicationFromClinic,
  removeGlobalMedication,
} from "@/api/medicationService";
import type {
  IMedication,
  IClinicMedication,
  IPatientPrescription,
} from "@/common/types/Medication";
import {
  buildRoleConfig,
  type SortOption,
  type ViewMode,
  type MedicationItem,
} from "./medicationRoleConfig";

function getItemName(item: MedicationItem): string {
  if (typeof (item as IMedication).med_name === "string") return (item as IMedication).med_name;
  return (item as IPatientPrescription).medName ?? "";
}

function getItemForm(item: MedicationItem): string {
  if (typeof (item as IMedication).med_form === "string") return (item as IMedication).med_form;
  return "";
}

const EMPTY_STATE = {
  filteredMedications: [] as MedicationItem[],
  totalCount: 0,
  isLoading: false,
  error: null as Error | null,
  viewMode: "catalog" as ViewMode,
  sortOptions: [] as SortOption[],
  searchTerm: "",
  sortOption: "az" as SortOption,
  handleSearchChange: (_e: React.ChangeEvent<HTMLInputElement>): void => {},
  handleSortChange: (_v: SortOption): void => {},
  handleDelete: (_item: IMedication | IClinicMedication): void => {},
};

export function useMedications() {
  const role = useRole();
  const clinicId = useAuthStore((s) => s.clinicId);
  const userId = useAuthStore((s) => s.userId);
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("az");

  const config = role ? buildRoleConfig(role) : null;

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["medications", role, clinicId ?? userId],
    queryFn: config?.queryFn ?? (() => Promise.resolve([])),
    enabled: !!role && (!!clinicId || !!userId),
  });

  if (!role || !config) return EMPTY_STATE;

  const filtered = data.filter((item) =>
    getItemName(item).toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "form") {
      return getItemForm(a).localeCompare(getItemForm(b));
    }
    const nameA = getItemName(a);
    const nameB = getItemName(b);
    return sortOption === "az"
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
  };

  const handleDelete = async (item: IMedication | IClinicMedication) => {
    try {
      const asClinic = item as IClinicMedication;
      if (typeof asClinic.clinic === "string") {
        await removeMedicationFromClinic(asClinic.clinic, asClinic.medication);
      } else {
        await removeGlobalMedication(item.id);
      }
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    } catch {
      // mutation failed — list remains unchanged until next successful query
    }
  };

  return {
    filteredMedications: sorted,
    totalCount: data.length,
    isLoading,
    error: error as Error | null,
    viewMode: config.viewMode,
    sortOptions: config.sortOptions,
    searchTerm,
    sortOption,
    handleSearchChange,
    handleSortChange,
    handleDelete,
  };
}
