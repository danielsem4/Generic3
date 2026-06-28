export function formatDate(value: string) {
  if (!value || value === "-") return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Plain DD/MM/YYYY HH:MM (24-hour). Date-only inputs render as `... 00:00`.
export function formatDateTime(value: string) {
  if (!value || value === "-") return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const pad = (n: number) => String(n).padStart(2, "0");
  const dd = pad(date.getDate());
  const mm = pad(date.getMonth() + 1);
  const yyyy = date.getFullYear();
  const hh = pad(date.getHours());
  const min = pad(date.getMinutes());

  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
}