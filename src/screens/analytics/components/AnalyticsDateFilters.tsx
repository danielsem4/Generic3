interface AnalyticsDateFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
}

export function AnalyticsDateFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: Readonly<AnalyticsDateFiltersProps>) {
  return (
    <div className="flex flex-wrap gap-3">
      <input
        type="date"
        value={startDate}
        onChange={(event) => onStartDateChange(event.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={endDate}
        onChange={(event) => onEndDateChange(event.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}