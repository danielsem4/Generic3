import React from "react";
import { useTranslation } from "react-i18next";
import { Pill, CheckCircle2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatientMedications } from "../hooks/usePatientMedications";
import { MedicationForm } from "./MedicationForm";
import { FullScreenFormModal } from "@/common/components/Patient-activities-meds/FullScreenFormModal";

interface IAddMedicationModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  userId: string;
}

export function AddMedicationModal({ isOpen, setIsOpen, userId }: IAddMedicationModalProps) {
  const { t, i18n } = useTranslation();
  const hookData = usePatientMedications(userId);

  const handleFinalizeAction = () => {
    hookData.handleFinalize(() => setIsOpen(false));
  };

    return (
    <FullScreenFormModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      dir={i18n.dir()}
      icon={<Pill className="text-primary rotate-45" size={32} />}
      title={t("patientMeds.newPrescription")}
      cancelText={t("patientMeds.cancel")}
      finalizeButton={
        <Button
          onClick={handleFinalizeAction}
          disabled={!hookData.selectedMed || hookData.isAddPending}
          className="min-w-[320px] h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center gap-3"
        >
          <CheckCircle2 size={24} />
          {t("patientMeds.finalize")}
        </Button>
      }
    >
      <MedicationForm hookData={hookData} />
    </FullScreenFormModal>
  );
}