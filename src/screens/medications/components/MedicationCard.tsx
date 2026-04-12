import { useState } from "react";
import { Pill, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { isPrescription } from "@/common/types/Medication";
import type {
  IMedication,
  IPatientPrescription,
  PrescriptionFrequency,
} from "@/common/types/Medication";
import type { ViewMode } from "../hooks/medicationRoleConfig";

interface Props {
  item: IMedication | IPatientPrescription;
  viewMode: ViewMode;
  canDelete: boolean;
  onDelete?: () => void;
}

const FREQ_KEYS: Record<PrescriptionFrequency, string> = {
  ONCE: "medications.freq.ONCE",
  DAILY: "medications.freq.DAILY",
  WEEKLY: "medications.freq.WEEKLY",
  MONTHLY: "medications.freq.MONTHLY",
};

export function MedicationCard({ item, viewMode, canDelete, onDelete }: Props) {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.();
    setDeleteOpen(false);
  };

  if (isPrescription(item)) {
    return (
      <Card className="bg-card hover:shadow-md transition-shadow border-border">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-3">
            <Pill size={18} className="text-primary rotate-45 shrink-0" />
            <span className="font-semibold text-foreground">
              {item.med_name}
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>
              {t("medications.dosage")}:{" "}
              <span className="text-foreground font-medium">{item.dosage}</span>
            </span>
            <span>
              {t("medications.frequency")}:{" "}
              <span className="text-foreground font-medium">
                {t(FREQ_KEYS[item.frequency])}
              </span>
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {t("medications.startDate")}: {item.start_date} →{" "}
            {t("medications.endDate")}: {item.end_date}
          </div>
        </CardContent>
      </Card>
    );
  } else {
    if (viewMode !== "catalog") return null;
    return (
      <Card className="bg-card hover:shadow-md transition-shadow border-border">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Pill size={18} className="text-primary rotate-45 shrink-0" />
            <span className="font-semibold text-foreground truncate">
              {item.med_name}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
              {item.med_form}
            </span>
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded">
              {item.med_unit}
            </span>
            {canDelete && onDelete && (
              <>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                  onClick={handleDeleteClick}
                >
                  <Trash2 size={16} />
                </button>
                <ConfirmDialog
                  open={deleteOpen}
                  onOpenChange={setDeleteOpen}
                  title={t("medications.deleteConfirmTitle")}
                  description={t("medications.deleteConfirmDesc")}
                  confirmLabel={t("medications.deleteConfirm")}
                  cancelLabel={t("nav.cancel")}
                  onConfirm={handleDeleteConfirm}
                  variant="destructive"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}
