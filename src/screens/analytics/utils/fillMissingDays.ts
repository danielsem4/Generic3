const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const fillMissingDays = (data: { day: string; count: number }[]) => {
  return DAYS.map((day) => ({
    name: day,
    count: data.find((item) => item.day === day)?.count ?? 0,
  }));
};