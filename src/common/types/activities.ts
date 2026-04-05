export interface IGlobalActivity {
  id: string;
  activity_name: string;
  activity_description: string;
}

export interface IClinicActivity extends IGlobalActivity {
  clinic: string;
  activity: string;
  is_active: boolean;
}
