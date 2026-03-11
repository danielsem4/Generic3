
 //Interface representing the medication catalog structure from the API

export interface Medication {
  id: string; 
  medName: string; // e.g., "AGRIPPAL S1 VAC 10X0.5mL"
  medForm: string; // e.g., "VAC", "TAB", "CAP"
  medUnitOfMeasurement: string; // e.g., "CF", "MG"
}