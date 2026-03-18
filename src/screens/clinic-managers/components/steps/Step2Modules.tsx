import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { ClinicFormValues } from "../../Schema/clinicSchema";

const MODULES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "document_share", label: "Document Share" },
  { id: "measurements", label: "Measurements" },
  { id: "chat", label: "Chat" },
  { id: "medications", label: "Medications" },
  { id: "Activities", label: "Activities" },
  { id: "Memory", label: "Memory" },
  { id: "cdt", label: "CDT" },
  { id: "Orientation", label: "Orientation" },
  { id: "HitBer", label: "HitBer" },
  { id: "TensTreatment", label: "Tens Treatment" },
  { id: "Parkinson", label: "Parkinson" },
  { id: "parkinson_report", label: "Parkinson Report" },
  { id: "parkinson_sensors", label: "Parkinson Sensors" },
  { id: "Statistics", label: "Statistics" },
  { id: "settings", label: "Settings" },
  { id: "Market test", label: "Market Test" },
  { id: "Pass", label: "Pass" },
];

interface Props {
  form: UseFormReturn<ClinicFormValues>;
}

export function Step2Modules({ form }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const selected = form.watch("availableModules");

  const filtered = MODULES.filter((m) =>
    m.label.toLowerCase().includes(search.toLowerCase()),
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
        {filtered.map((module) => {
          const isSelected = selected.includes(module.id);
          return (
            <button
              key={module.id}
              type="button"
              onClick={() => handleToggle(module.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors",
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-foreground",
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center",
                  isSelected ? "border-primary bg-primary" : "border-border",
                )}
              >
                {isSelected && (
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                )}
              </span>
              {module.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
