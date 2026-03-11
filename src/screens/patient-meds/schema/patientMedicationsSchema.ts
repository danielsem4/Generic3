// Define exactly as the professor's table
export interface PatientMedicine {
  medicine: string;        
  patient: string;        
  clinic: string;          
  doctor: string;          
  frequency: 'once' | 'daily' | 'weekly' | 'monthly';
  frequency_data: string[]; 
  start_date: string;     
  end_date: string;     
  dosage: string;         
  medName?: string;  
  medForm?: string;       
}

// Interface for the actual intake history
export interface IntakeLog {
  intakeDate: string;
  intakeTime: string;
  medicineId: string;
  medName: string;
  medForm: string;
  dosage: string;
}