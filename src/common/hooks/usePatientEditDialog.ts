import { useEffect, useState } from "react";
import type { IPatientDetails } from "@/common/types/patientDetails";
import { updatePatient } from "@/api/usersApi";

type PatientWithId = IPatientDetails & { id?: string };

function getPatientId(patient: PatientWithId): string {
  return patient.patientId || patient.id || "";
}

export function usePatientEditDialog(
  patient: PatientWithId,
  onUpdated?: (patient: IPatientDetails) => void
) {
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setPhone(patient.phone);
    setEmail(patient.email);
  }, [patient]);

  async function handleSave(): Promise<boolean> {
    setLoading(true);

    try {
      const updated = await updatePatient(getPatientId(patient), {
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone,
      });

      const mapped: IPatientDetails = {
        patientId: updated.patient_id,
        firstName: updated.first_name,
        lastName: updated.last_name,
        phone: updated.phone_number,
        email: updated.email,
        isResearch: updated.is_research,
        clinicName: updated.clinic_name,
      };

      onUpdated?.(mapped);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    firstName,
    lastName,
    phone,
    email,
    setFirstName,
    setLastName,
    setPhone,
    setEmail,
    handleSave,
    loading,
  };
}