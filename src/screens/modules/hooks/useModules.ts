import type { ElementType } from "react";
import { useModulesQuery } from "@/hooks/queries/useModulesQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { getModuleConfig } from "../moduleConfig";
import type { ModuleAccent } from "../moduleConfig";

export type ModuleItem = {
  key: string;
  icon: ElementType;
  accent: ModuleAccent;
  href: string;
};

interface UseModulesResult {
  items: ModuleItem[];
  isLoading: boolean;
  error: Error | null;
}

export function useModules(): UseModulesResult {
  const clinicId = useAuthStore((s) => s.clinicId);
  const { data: modules, isLoading, error } = useModulesQuery(clinicId);

  const items: ModuleItem[] = (modules ?? []).map((module) => {
    const normalizedName = module.module_name.toLowerCase();
    const config = getModuleConfig(normalizedName);

    return {
      key: normalizedName,
      icon: config.icon,
      accent: config.accent,
      href: `/modules/${normalizedName.replace(/\s+/g, "-")}`,
    };
  });

  return { items, isLoading, error: error as Error | null };
}
