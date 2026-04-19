import type { IPatientDetails } from "@/common/types/patientDetails";
import { usePatientEditDialog } from "@/common/hooks/usePatientEditDialog";
import PatientInfoEditDialog from "@/common/components/Patient+measurementPage/EditDetailsDialog";

interface Props {
  readonly patient: IPatientDetails;
}

export default function PatientEditDialog({ patient }: Props) {
  const dialog = usePatientEditDialog(patient);

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
      onSave={dialog.handleSave}
    />
  );
}