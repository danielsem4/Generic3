import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2, Pencil, Bell, CheckCircle2, Pill } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { IPatientMedicine } from "../schema/patientMedicationsSchema";

interface MedicationCardProps {
  prescription: IPatientMedicine;
  onDelete: (id: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({ prescription, onDelete }) => {
  const { t } = useTranslation();

  const handleDeleteConfirm = () => {
    onDelete(prescription.medicine);
  };

  return (
    <Card className="border-border bg-card shadow-sm rounded-md overflow-hidden w-full mb-1">
      <CardContent className="p-0 px-4 flex justify-between items-center h-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 bg-muted/30 rounded-full border border-border h-8">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="p-0.5 text-muted-foreground hover:text-destructive cursor-pointer"><Trash2 size={15} /></button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("patientMeds.deleteConfirm.title")}</AlertDialogTitle>
                  <AlertDialogDescription>{t("patientMeds.deleteConfirm.description")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("patientMeds.deleteConfirm.cancel")}</AlertDialogCancel>
                  <AlertDialogAction 
                  className="bg-destructive" 
                  onClick={handleDeleteConfirm}>
                    {t("patientMeds.deleteConfirm.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button className="p-0.5 text-muted-foreground hover:text-primary border-x border-border px-2 cursor-pointer"><Pencil size={15} /></button>
            <button className="p-1 text-muted-foreground hover:text-warning cursor-pointer"><Bell size={15} /></button>
          </div>
          <CheckCircle2 className="text-success opacity-90" size={18} />
        </div>

        <div className="flex items-center gap-4 text-right">
          <div className="flex flex-col justify-center leading-tight">
            <span className="font-bold text-foreground text-[15px] uppercase tracking-tight">{prescription.medName}</span>
            <span className="text-[11px] text-muted-foreground font-medium">{t("patientMeds.regularDosage")}</span>
          </div>
          <div className="p-1.5 bg-primary/10 rounded-full"><Pill className="text-primary rotate-45" size={20} /></div>
        </div>
      </CardContent>
    </Card>
  );
}