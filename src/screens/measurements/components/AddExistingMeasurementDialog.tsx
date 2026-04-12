import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IMeasurement } from "@/common/types/measurement";
import { useAddExistingMeasurement } from "../hooks/useAddExistingMeasurement";

interface AddExistingMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (measurement: IMeasurement) => void;
}

export function AddExistingMeasurementDialog({
  open,
  onOpenChange,
  onAdd,
}: AddExistingMeasurementDialogProps) {
  const { t } = useTranslation();
  const {
    searchTerm,
    handleSearchChange,
    filteredMeasurements,
    selectedId,
    handleSelect,
    handleAdd,
    handleClose,
  } = useAddExistingMeasurement();

  function handleOpenChange(isOpen: boolean) {
    handleClose(isOpen);
    onOpenChange(isOpen);
  }

  function handleConfirm() {
    handleAdd(onAdd);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("measurements.addExistingTitle")}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search
            size={18}
            className="absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none"
          />
          <Input
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t("measurements.searchExisting")}
            className="pl-9"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 border border-border rounded-md p-2">
          {filteredMeasurements.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t("measurements.noExistingData")}
            </p>
          )}
          {filteredMeasurements.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-accent ${
                selectedId === m.id ? "bg-accent" : ""
              }`}
            >
              <input
                type="radio"
                name="existing-measurement"
                checked={selectedId === m.id}
                onChange={() => handleSelect(m.id)}
                className="accent-primary"
              />
              <span className="text-sm text-foreground">{m.name}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("measurements.cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            {t("measurements.add")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
