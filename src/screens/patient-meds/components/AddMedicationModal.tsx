import React from "react";
import { useTranslation } from "react-i18next";
import { Pill, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePatientMedications } from "../hooks/usePatientMedications";
import { MedicationForm } from "./MedicationForm";

interface IAddMedicationModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AddMedicationModal({ isOpen, setIsOpen }: IAddMedicationModalProps) {
  const { t, i18n } = useTranslation();
  const hookData = usePatientMedications("123");

  const handleFinalizeAction = () => {
    hookData.handleFinalize();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="!fixed !inset-0 !z-[100] !max-w-none !w-screen !h-screen !m-0 !p-0 !bg-background !border-none !translate-x-0 !translate-y-0 !rounded-none overflow-y-auto"
        dir={i18n.dir()}
      >
        <div className="flex justify-center items-start w-full min-h-screen bg-background">
          <div className="w-full max-w-4xl py-12 px-6 flex flex-col gap-10">
            
            <DialogHeader className="text-center flex flex-col items-center relative">
              <div className="bg-primary/10 p-4 rounded-3xl w-fit mb-4">
                <Pill className="text-primary rotate-45" size={32} />
              </div>
              <DialogTitle className="text-4xl font-extrabold tracking-tight">
                {t("patientMeds.newPrescription")}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="absolute -right-2 -top-2 rounded-full h-10 w-10 text-muted-foreground hover:bg-secondary">
                  <X size={24} />
                </Button>
              </DialogClose>
            </DialogHeader>

            <MedicationForm hookData={hookData} />

            <div className="flex justify-center gap-5 pt-8 border-t mt-4 pb-12 bg-background">
              <Button 
                onClick={handleFinalizeAction}
                disabled={!hookData.selectedMed} 
                className="min-w-[320px] h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center gap-3"
              >
                <CheckCircle2 size={24} /> {t("patientMeds.finalize")}
              </Button>
              
              <DialogClose asChild>
                <Button variant="ghost" className="h-16 px-10 text-xl font-semibold text-muted-foreground hover:bg-secondary rounded-2xl">
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