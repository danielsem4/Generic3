import { useState } from "react";
import type { ElementType } from "react";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { getModuleConfig } from "../moduleConfig";
import type { ModuleAccent } from "../moduleConfig";

export type ModuleItem = {
  id: number;
  key: string;
  module_name: string;
  module_description?: string;
  icon: ElementType;
  accent: ModuleAccent;
  href: string;
};

interface UseModulesResult {
  filteredItems: ModuleItem[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function useModules(): UseModulesResult {
  const clinicId = useAuthStore((s) => s.clinicId);
  const { data: modules, isLoading, error } = useModulesQuery(clinicId);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  const items: ModuleItem[] = (modules ?? []).map((module) => {
    const normalizedName = module.module_name.toLowerCase();
    const config = getModuleConfig(normalizedName);

    return {
      id: module.id,
      key: normalizedName,
      module_name: module.module_name,
      module_description: module.module_description,
      icon: config.icon,
      accent: config.accent,
      href: `/modules/${normalizedName.replace(/\s+/g, "-")}`,
    };
  });

  const filteredItems = items.filter((item) =>
    item.module_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return { filteredItems, isLoading, error: error as Error | null, searchTerm, handleSearchChange };
}
