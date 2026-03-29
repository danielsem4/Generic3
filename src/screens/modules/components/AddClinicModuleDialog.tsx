import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IModule } from "@/common/types/patientDetails";

interface Props {
  isOpen: boolean;
  availableModules: IModule[];
  selectedIds: Set<number>;
  isSaving: boolean;
  onClose: () => void;
  onToggle: (id: number) => void;
  onSave: () => void;
}

export function AddClinicModuleDialog({
  isOpen,
  availableModules,
  selectedIds,
  isSaving,
  onClose,
  onToggle,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const filtered = availableModules.filter((m) =>
    m.module_name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("modules.addClinicModuleTitle")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("modules.searchPlaceholder")}
              value={search}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {selectedIds.size} {t("modules.columnName").toLowerCase()}
          </p>

          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
            {filtered.map((module) => {
              const isSelected = selectedIds.has(module.id);
              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => onToggle(module.id)}
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
                    {isSelected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                  </span>
                  <span className="flex-1 truncate">{module.module_name}</span>
                  {module.module_description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {module.module_description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            {t("modules.cancel")}
          </Button>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("modules.saveModules")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
