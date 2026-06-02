import type { IPatientDetails } from "@/common/types/patientDetails";
import { usePatientEditDialog } from "@/common/hooks/usePatientEditDialog";
import PatientInfoEditDialog from "@/common/components/Patient+measurementPage/EditDetailsDialog";

interface Props {
  readonly patient: IPatientDetails;
  readonly onUpdated?: (patient: IPatientDetails) => void;
}

export default function PatientEditDialog({ patient, onUpdated }: Props) {
  const dialog = usePatientEditDialog(patient, onUpdated);

  const handleSave = async () => {
    const success = await dialog.handleSave();

    if (!success) {
      alert("Failed to save patient details. Please try again.");
    }
  };

  return (
    <PatientInfoEditDialog
      firstName={dialog.firstName}
      lastName={dialog.lastName}
      phone={dialog.phone}
      email={dialog.email}
      setFirstName={dialog.setFirstName}
      setLastName={dialog.setLastName}
      setPhone={dialog.setPhone}
      setEmail={dialog.setEmail}
      onSave={handleSave}
      loading={dialog.loading}
    />
  );
}