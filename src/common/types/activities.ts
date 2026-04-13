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

export interface IBasePatientActivity {
  id: string;
  activity_name: string;
  category?: string;
  start_date?: string;
  end_date?: string;
}

export interface IOncePatientActivity extends IBasePatientActivity {
  frequency: "ONCE";
  frequency_data: {
    date: string;
    time_slots: string[];
  };
}

export interface IDailyPatientActivity extends IBasePatientActivity {
  frequency: "DAILY";
  frequency_data: {
    times_per_day: number;
    time_slots: string[];
  };
}

export interface IWeeklyPatientActivity extends IBasePatientActivity {
  frequency: "WEEKLY";
  frequency_data: {
    days_of_week: string[];
    time: string;
  };
}

export interface IMonthlyPatientActivity extends IBasePatientActivity {
  frequency: "MONTHLY";
  frequency_data: {
    day_of_month: number;
    time: string;
  };
}

export type IPatientActivity =
  | IOncePatientActivity
  | IDailyPatientActivity
  | IWeeklyPatientActivity
  | IMonthlyPatientActivity;

export interface IActivityLog {
  id: string;
  activity_name: string;
  time_done: string;
}

export interface IActivityLogFilters {
  activity_name?: string;
  start_date?: string;
}