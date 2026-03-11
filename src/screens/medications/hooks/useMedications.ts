import { useMemo, useState } from "react";
import type { Medication } from "../schema/medicationsSchema";



 //Custom hook to manage medication data and search logic.
export function useMedications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSorted, setIsSorted] = useState(false);

  // Mock data representing the medications from your image
const medications: Medication[] = [
    { id: "1000000001", medName: "DUODOPA INTESTINAL GEL 2g/0.5g 28X100mL", medForm: "GEL", medUnitOfMeasurement: "MG" },
    { id: "1000000002", medName: "PENICILLAMINE GSK 29/M TAB 250MG 56", medForm: "TAB", medUnitOfMeasurement: "MG" },
    { id: "1000000003", medName: "METHYLDOPA 250MG TAB", medForm: "TAB", medUnitOfMeasurement: "MG" },
    { id: "1000000004", medName: "ASPIRIN TAB 500MG 20", medForm: "TAB", medUnitOfMeasurement: "MG" },
    { id: "1000000005", medName: "ADVIL FORTE LIQUI-GELS CAP 400mg 20", medForm: "CAP", medUnitOfMeasurement: "MG" },
    { id: "1000000006", medName: "AGRIPPAL S1 VAC 10X0.5mL", medForm: "VAC", medUnitOfMeasurement: "ML" },
    { id: "1000000007", medName: "LEVODOPA - CARBIDOPA CD TAB 50mg/200mg", medForm: "TAB", medUnitOfMeasurement: "MG" },
    { id: "1000000008", medName: "CARBIDOPA / LEVODOPA TAB 25mg/250mg", medForm: "TAB", medUnitOfMeasurement: "MG" },
    { id: "1000000009", medName: "SINEMET ORAL SUS 5mg/ml 1.25mg/ml 100ml", medForm: "SUS", medUnitOfMeasurement: "ML" }
  ];
  
  // Filtering the list based on the user's search input
 const filtered = medications.filter((med) =>
    med.medName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedications = useMemo(() => {
    const result = [...filtered];
    if (isSorted) {
      result.sort((a, b) => a.medName.localeCompare(b.medName));
    }
    return result;
  }, [filtered, isSorted]);

return {
    searchTerm,
    setSearchTerm,
    isSorted,
    toggleSort: () => setIsSorted(!isSorted),
    filteredMedications,
    totalCount: medications.length,
  };
}