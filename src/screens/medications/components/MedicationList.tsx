import { Pill } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MedicationCard } from "./MedicationCard";
import type { ViewMode, MedicationItem } from "../hooks/medicationRoleConfig";
import type { IMedication, IClinicMedication, IPatientPrescription } from "@/common/types/Medication";
import { isCatalogItem } from "@/common/types/Medication";

interface ListProps {
  medications: MedicationItem[];
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete: (item: IMedication | IClinicMedication) => void;
  totalCount: number;
}

interface ItemProps {
  item: MedicationItem;
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete: (item: IMedication | IClinicMedication) => void;
  index: number;
}

function getDisplayItem(item: MedicationItem): IMedication | IPatientPrescription {
  return item as IMedication | IPatientPrescription;
}

function MedicationListItem({ item, viewMode, canDelete, onDelete, index }: ItemProps) {
  const displayItem = getDisplayItem(item);

  let handleDelete: (() => void) | undefined;
  if (canDelete) {
    const asClinic = item as IClinicMedication;
    if (typeof asClinic.clinic === "string") {
      handleDelete = () => onDelete(asClinic);
    } else if (isCatalogItem(item as IMedication | IPatientPrescription)) {
      handleDelete = () => onDelete(item as IMedication);
    }
  }

  return (
    <MedicationCard
      key={displayItem.id || index}
      item={displayItem}
      viewMode={viewMode}
      canDelete={canDelete}
      onDelete={handleDelete}
    />
  );
}

export function MedicationList({ medications, viewMode, canDelete, onDelete, totalCount }: ListProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-bold text-foreground">
        <Pill className="text-primary rotate-45" size={22} />
        <span>{t("medications.allMedications")} ({totalCount})</span>
      </div>

      <div className="space-y-2">
        {medications.map((item, index) => (
          <MedicationListItem
            key={getDisplayItem(item).id || index}
            item={item}
            viewMode={viewMode}
            canDelete={canDelete}
            onDelete={onDelete}
            index={index}
          />
        ))}

        {medications.length === 0 && (
          <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
            {t("medications.noData")}
          </div>
        )}
      </div>
    </div>
  );
}
