import { Pill } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MedicationCard } from "./MedicationCard";
import type { ViewMode, MedicationItem } from "../hooks/medicationRoleConfig";
import type { IMedication, IClinicMedication, IPatientPrescription } from "@/common/types/Medication";

interface Props {
  medications: MedicationItem[];
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete: (item: IClinicMedication) => void;
  totalCount: number;
}

function getDisplayItem(item: MedicationItem): IMedication | IPatientPrescription {
  if ("medication" in item) return item.medication;
  return item as IMedication | IPatientPrescription;
}

export function MedicationList({ medications, viewMode, canDelete, onDelete, totalCount }: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Pill className="text-primary rotate-45" size={22} />
        <span>{t("medications.allMedications")} ({totalCount})</span>
      </div>

      <div className="space-y-2">
        {medications.map((item, index) => {
          const displayItem = getDisplayItem(item);
          const handleDelete =
            canDelete && "medication" in item
              ? () => onDelete(item as IClinicMedication)
              : undefined;

          return (
            <MedicationCard
              key={displayItem.id || index}
              item={displayItem}
              viewMode={viewMode}
              canDelete={canDelete}
              onDelete={handleDelete}
            />
          );
        })}

        {medications.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
            {t("medications.noData")}
          </div>
        )}
      </div>
    </div>
  );
}
