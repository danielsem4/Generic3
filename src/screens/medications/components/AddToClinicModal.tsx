import { PlusCircle, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddToClinicDialog } from "../hooks/useAddToClinicDialog";

interface MedicationSelectItemProps {
  id: string;
  medName: string;
  medForm: string;
  checked: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
}

function MedicationSelectItem({
  id,
  medName,
  medForm,
  checked,
  disabled,
  onToggle,
}: MedicationSelectItemProps) {
  const handleChange = () => {
    onToggle(id);
  };

  return (
    <label className={`flex items-center gap-3 p-2 rounded ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent cursor-pointer"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="accent-primary"
      />
      <span className="text-sm text-foreground">{medName}</span>
      <span className="ml-auto text-xs text-muted-foreground">{medForm}</span>
    </label>
  );
}

export function AddToClinicModal() {
  const { t } = useTranslation();
  const {
    open,
    handleClose,
    localSearch,
    handleLocalSearchChange,
    filteredGlobal,
    selected,
    clinicMedIds,
    toggleSelect,
    isSubmitting,
    isLoading,
    onConfirm,
  } = useAddToClinicDialog();

  const handleCloseCancel = () => {
    handleClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex gap-2 h-11 px-6 font-bold shadow-sm">
          <PlusCircle size={18} /> {t("medications.addToClinic")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-card border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold text-center text-foreground mb-4">
            {t("medications.addToClinicTitle")}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-3">
          <Search
            size={18}
            className="absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none"
          />
          <Input
            value={localSearch}
            onChange={handleLocalSearchChange}
            placeholder={t("medications.searchGlobal")}
            className="pl-9 border-border"
          />
        </div>

        <div className="max-h-64 overflow-y-auto space-y-1 border border-border rounded-md p-2">
          {isLoading && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("home.loading")}
            </p>
          )}
          {filteredGlobal.map((med) => (
            <MedicationSelectItem
              key={med.id}
              id={med.id}
              medName={med.med_name}
              medForm={med.med_form}
              checked={selected.has(med.id) || clinicMedIds.has(med.id)}
              disabled={clinicMedIds.has(med.id)}
              onToggle={toggleSelect}
            />
          ))}
          {!isLoading && filteredGlobal.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("medications.noData")}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleCloseCancel}>
            {t("nav.cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selected.size === 0 || isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
          >
            {t("medications.confirm")}{" "}
            {selected.size > 0 && `(${selected.size})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
