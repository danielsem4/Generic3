import { useTranslation } from "react-i18next";
import { Pill, CheckCircle2} from "lucide-react";
import { usePatientMedications } from "../hooks/usePatientMedications";
import { MedicationForm } from "./MedicationForm";
import { FullScreenFormModal } from "@/common/components/FullScreenFormModal";
import { LoadingButton } from "@/components/ui/LoadingButton";

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
        <LoadingButton
          onClick={handleFinalizeAction}
          disabled={!hookData.selectedMed} 
          loading={hookData.isAddPending} 
          loadingText={t("common.loading.adding", "Adding...")}
          className="min-w-[320px] h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl hover:opacity-95 flex items-center justify-center gap-3"
        >
          <CheckCircle2 size={24} />
          <span>{t("patientMeds.finalize")}</span>
        </LoadingButton>
      }
    >
      <MedicationForm hookData={hookData} />
    </FullScreenFormModal>
  );
}