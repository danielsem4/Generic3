type TFrequency = "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";

interface IBuildFrequencyDataParams {
  frequency: TFrequency;
  startDate: string;
  timeSlots: string[];
  selectedDays: string[];
  dayOfMonth: string;
  defaultTime?: string;
}

export function buildFrequencyData({
  frequency,
  startDate,
  timeSlots,
  selectedDays,
  dayOfMonth,
  defaultTime = "09:00",
}: IBuildFrequencyDataParams) {
  if (frequency === "ONCE") {
    return {
      date: startDate,
      time_slots: timeSlots,
    };
  }

  if (frequency === "DAILY") {
    return {
      times_per_day: timeSlots.length,
      time_slots: timeSlots,
    };
  }

  if (frequency === "WEEKLY") {
    return {
      days_of_week: selectedDays,
      time: timeSlots[0] ?? defaultTime,
    };
  }

  return {
    day_of_month: Number(dayOfMonth),
    time: timeSlots[0] ?? defaultTime,
  };
}