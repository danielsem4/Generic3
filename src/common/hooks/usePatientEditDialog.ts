import { useEffect, useState } from "react";
import type { IPatientDetails } from "@/common/types/patientDetails";

export function usePatientEditDialog(patient: IPatientDetails) {
  const [firstName, setFirstName] = useState(patient.firstName);
  const [lastName, setLastName] = useState(patient.lastName);
  const [phone, setPhone] = useState(patient.phone);
  const [email, setEmail] = useState(patient.email);

  useEffect(() => {
    setFirstName(patient.firstName);
    setLastName(patient.lastName);
    setPhone(patient.phone);
    setEmail(patient.email);
  }, [patient]);

  function handleSave() {
    console.log({
      patientId: patient.patientId,
      firstName,
      lastName,
      phone,
      email,
    });
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
  };
}