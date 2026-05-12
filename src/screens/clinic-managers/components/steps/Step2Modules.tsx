import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { ClinicFormValues } from "../../schema/clinicSchema";
import { useAllModulesQuery } from "@/hooks/queries/useAllModulesQuery";

interface Props {
  form: UseFormReturn<ClinicFormValues>;
}

export function Step2Modules({ form }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const selected = form.watch("availableModules");
  const { data: modules = [], isLoading, isError } = useAllModulesQuery();

  const filtered = modules.filter((m) =>
    m.module_name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleToggle = (moduleId: string) => {
    const current = form.getValues("availableModules");
    form.setValue(
      "availableModules",
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("clinicManagers.modulesSearchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {t("clinicManagers.modulesSelected", { count: selected.length })}
      </p>

      <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
        {isLoading && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md animate-pulse"
              >
                <div className="w-4 h-4 rounded border-2 border-border bg-muted shrink-0" />
                <div className="h-4 bg-muted rounded w-32" />
              </div>
            ))}
          </>
        )}

        {isError && (
          <p className="text-sm text-destructive px-3 py-2">
            {t("clinicManagers.modulesLoadError")}
          </p>
        )}

        {!isLoading &&
          !isError &&
          filtered.map((module) => {
            const moduleId = String(module.id);
            const isSelected = selected.includes(moduleId);
            return (
              <button
                key={module.id}
                type="button"
                onClick={() => handleToggle(moduleId)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-muted text-foreground",
                )}
              >
                <span
                  className={cn(
                    "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center",
                    isSelected ? "border-primary bg-primary" : "border-border",
                  )}
                >
                  {isSelected && (
                    <Check className="w-2.5 h-2.5 text-primary-foreground" />
                  )}
                </span>
                {module.module_name}
              </button>
            );
          })}
      </div>
    </div>
  );
}
