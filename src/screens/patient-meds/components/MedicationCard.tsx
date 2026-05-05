import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Bell, CheckCircle2, Pill } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { IPatientPrescription } from "@/common/types/Medication";
import { DeleteButton } from "@/common/components/DeleteButton";

interface MedicationCardProps {
  prescription: IPatientPrescription;
  onDelete: (id: string) => void;
  onEdit: (prescription: IPatientPrescription) => void;
  canManage: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  prescription,
  onDelete,
  onEdit,
  canManage,
}) => {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="border-border bg-card shadow-sm rounded-md overflow-hidden w-full mb-1">
      <CardContent className="p-0 px-4 flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          {canManage && (
            <div className="flex items-center gap-1 px-2 bg-muted/30 rounded-full border border-border h-8">
              
              <DeleteButton onClick={() => setDeleteOpen(true)} />

              <button
                onClick={() => onEdit(prescription)}
                className="p-0.5 text-muted-foreground hover:text-primary border-x border-border px-2 cursor-pointer"
              >
                <Pencil size={15} />
              </button>

              <button className="p-1 text-muted-foreground hover:text-warning cursor-pointer">
                <Bell size={15} />
              </button>
            </div>
          )}

          <CheckCircle2 className="text-success opacity-90" size={18} />
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-bold text-foreground text-[15px] uppercase tracking-tight">
              {prescription.med_name}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              {t("patientMeds.regularDosage")}
            </span>
          </div>

          <div className="p-1.5 bg-primary/10 rounded-full">
            <Pill className="text-primary rotate-45" size={20} />
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("patientMeds.deleteConfirm.title")}
        description={t("patientMeds.deleteConfirm.description")}
        confirmLabel={t("patientMeds.deleteConfirm.confirm")}
        cancelLabel={t("patientMeds.deleteConfirm.cancel")}
        onConfirm={() => {
          onDelete(prescription.id);
          setDeleteOpen(false);
        }}
        variant="destructive"
      />
    </Card>
  );
};