import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pill, Save, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditMedication } from "../hooks/useEditMedication";
import type { IPatientPrescription } from "@/common/types/Medication";

interface IEditMedicationModalProps {
  prescription: IPatientPrescription | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  patientId: string;
}

export function EditMedicationModal({ prescription, isOpen, setIsOpen, patientId }: IEditMedicationModalProps) {
  const { t, i18n } = useTranslation();
  const {
    dosage, setDosage,
    startDate, setStartDate,
    endDate, setEndDate,
    frequency, setFrequency,
    initForm,
    submitEdit,
    isPending,
  } = useEditMedication(patientId);

  useEffect(() => {
    if (prescription) initForm(prescription);
  }, [prescription, initForm]);

  const handleSave = () => {
    if (!prescription) return;
    submitEdit(prescription.id, {
      onSuccess: () => setIsOpen(false),
    });
  };

  const handleDosageChange = (e: React.ChangeEvent<HTMLInputElement>) => setDosage(e.target.value);
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value);
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value);
  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFrequency(e.target.value as IPatientPrescription["frequency"]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="!fixed !inset-0 !z-[100] !max-w-none !w-screen !h-screen !m-0 !p-0 !bg-background !border-none !translate-x-0 !translate-y-0 !rounded-none overflow-y-auto"
        dir={i18n.dir()}
      >
        <div className="flex justify-center items-start w-full min-h-screen bg-background">
          <div className="w-full max-w-2xl py-12 px-6 flex flex-col gap-10">

            <DialogHeader className="text-center flex flex-col items-center relative">
              <div className="bg-primary/10 p-4 rounded-3xl w-fit mb-4">
                <Pill className="text-primary rotate-45" size={32} />
              </div>
              <DialogTitle className="text-4xl font-extrabold tracking-tight">
                {t("patientMeds.editPrescription")}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute -right-2 -top-2 rounded-full h-10 w-10 text-muted-foreground hover:bg-secondary">
                  <X size={24} />
                </Button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-6">
              {/* Medication name — read only */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("patientMeds.medicationLabel")}
                </span>
                <div className="h-11 px-4 flex items-center bg-muted/30 rounded-lg border border-border text-foreground font-bold uppercase tracking-tight">
                  {prescription?.med_name}
                </div>
              </div>

              {/* Dosage */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("patientMeds.dosageLabel")}
                </span>
                <Input
                  value={dosage}
                  onChange={handleDosageChange}
                  className="h-11 bg-card border-border"
                />
              </div>

              {/* Start / End date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("patientMeds.startDate")}
                  </span>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="h-11 bg-card border-border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    {t("patientMeds.endDate")}
                  </span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="h-11 bg-card border-border"
                  />
                </div>
              </div>

              {/* Frequency */}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t("patientMeds.frequencyLabel")}
                </span>
                <select
                  value={frequency}
                  onChange={handleFrequencyChange}
                  className="h-11 w-full border border-border rounded-lg px-3 bg-card text-foreground outline-none"
                >
                  <option value="ONCE">{t("patientMeds.frequencyOptions.once")}</option>
                  <option value="DAILY">{t("patientMeds.frequencyOptions.daily")}</option>
                  <option value="WEEKLY">{t("patientMeds.frequencyOptions.weekly")}</option>
                  <option value="MONTHLY">{t("patientMeds.frequencyOptions.monthly")}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center gap-5 pt-8 border-t pb-12">
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="min-w-[280px] h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center gap-3"
              >
                <Save size={22} /> {t("patientMeds.saveChanges")}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" className="h-14 px-10 text-xl font-semibold text-muted-foreground hover:bg-secondary rounded-2xl">
                  {t("patientMeds.cancel")}
                </Button>
              </DialogClose>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
