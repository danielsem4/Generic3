import type { AnalyticsItem } from "../hooks/useAnalyticsPage";

export const ANALYTICS_ACCENT_STYLES: Record<
  AnalyticsItem["accent"],
  { border: string; iconBg: string; iconText: string }
> = {
  orange: {
    border: "border-amber-200",
    iconBg: "bg-amber-50",
    iconText: "text-amber-500",
  },
  blue: {
    border: "border-sky-200",
    iconBg: "bg-sky-50",
    iconText: "text-sky-500",
  },
  purple: {
    border: "border-violet-200",
    iconBg: "bg-violet-50",
    iconText: "text-violet-500",
  },
};