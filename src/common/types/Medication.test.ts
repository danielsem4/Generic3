import { describe, it, expect } from "vitest";
import { isCatalogItem } from "./Medication";
import type { IMedication, IPatientPrescription } from "./Medication";

const catalogItem: IMedication = {
  id: "1",
  medName: "Aspirin",
  medForm: "TAB",
  medUnitOfMeasurement: "MG",
};

const prescriptionItem: IPatientPrescription = {
  id: "2",
  patientId: "p1",
  clinicId: "c1",
  doctorId: "d1",
  medicationId: "1",
  medName: "Aspirin",
  startDate: "2025-01-01",
  endDate: "2025-04-01",
  dosage: "500mg",
  frequency: "DAILY",
};

describe("isCatalogItem", () => {
  it("returns true for IMedication", () => {
    expect(isCatalogItem(catalogItem)).toBe(true);
  });

  it("returns false for IPatientPrescription", () => {
    expect(isCatalogItem(prescriptionItem)).toBe(false);
  });

  it("returns false for IClinicMedication cast to the union (structural check)", () => {
    const clinicMedAsUnion = {
      id: "cm1",
      clinicId: "c1",
      medicationId: "1",
      medication: catalogItem,
      medName: "Aspirin",
      startDate: "2025-01-01",
      endDate: "2025-04-01",
      dosage: "500mg",
      frequency: "DAILY" as const,
    } as unknown as import("./Medication").IMedication | import("./Medication").IPatientPrescription;
    expect(isCatalogItem(clinicMedAsUnion)).toBe(false);
  });
});
