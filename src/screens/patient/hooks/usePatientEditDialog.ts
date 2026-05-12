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

  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPhone(event.target.value);
  }

  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  function handleSave() {
    // TODO: wire up patient edit API call
  }

  return {
    firstName,
    lastName,
    phone,
    email,
    handleFirstNameChange,
    handleLastNameChange,
    handlePhoneChange,
    handleEmailChange,
    handleSave,
  };
}