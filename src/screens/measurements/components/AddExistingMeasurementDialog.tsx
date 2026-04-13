import { useTranslation } from "react-i18next";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MeasurementType } from "@/common/types/measurement";
import type { IMeasurement } from "@/common/types/measurement";
import { useAddExistingMeasurement } from "../hooks/useAddExistingMeasurement";

const TYPE_LABEL_KEYS: Record<MeasurementType, string> = {
  [MeasurementType.QUESTIONNAIRES]: "measurements.types.questionnaries",
  [MeasurementType.COGNITIVE_TESTS]: "measurements.types.cognitiveTests",
  [MeasurementType.MODULE_QUESTIONNAIRE]: "measurements.types.moduleQuestionnaire",
};

interface AddExistingMeasurementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clinicMeasurements: IMeasurement[];
  onAdoptSuccess: () => void;
}

export function AddExistingMeasurementDialog({
  open,
  onOpenChange,
  clinicMeasurements,
  onAdoptSuccess,
}: AddExistingMeasurementDialogProps) {
  const { t } = useTranslation();
  const {
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
  } = useAddExistingMeasurement(clinicMeasurements);

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) handleClose();
    onOpenChange(isOpen);
  }

  async function handleConfirm() {
    const success = await handleAdopt();
    if (success) {
      handleClose();
      onAdoptSuccess();
    }
  }

  function handleToggleAll() {
    if (allSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
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

        <div className="flex items-center gap-2">
          <Switch
            id="show-adopted"
            checked={showAdopted}
            onCheckedChange={handleToggleShowAdopted}
          />
          <Label htmlFor="show-adopted" className="text-sm cursor-pointer">
            {t("measurements.showAdopted")}
          </Label>
        </div>

        <div className="max-h-64 overflow-y-auto border border-border rounded-md">
          {isLoadingPublic ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : filteredMeasurements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t("measurements.noExistingData")}
            </p>
          ) : (
            <>
              <label className="flex items-center gap-3 p-2 border-b border-border cursor-pointer hover:bg-accent">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  className="accent-primary"
                />
                <span className="text-sm font-medium text-foreground">
                  {allSelected
                    ? t("measurements.deselectAll")
                    : t("measurements.selectAll")}
                </span>
              </label>
              {filteredMeasurements.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-3 p-2 cursor-pointer hover:bg-accent ${
                    selectedIds.has(m.id) ? "bg-accent" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(m.id)}
                    onChange={() => handleToggle(m.id)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">{m.name}</span>
                  {clinicIds.has(m.id) && (
                    <Badge variant="secondary" className="text-xs">
                      {t("measurements.alreadyAdded")}
                    </Badge>
                  )}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {t(TYPE_LABEL_KEYS[m.type])}
                  </Badge>
                </label>
              ))}
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t("measurements.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedIds.size === 0 || isAdopting}
          >
            {isAdopting ? (
              <Loader2 className="animate-spin mr-2" size={16} />
            ) : null}
            {t("measurements.addCount", { count: selectedIds.size })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
