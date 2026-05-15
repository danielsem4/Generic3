import * as React from "react";
import {
  Activity,
  Pill,
  ClipboardList,
} from "lucide-react";

export type AnalyticsItem = {
  key: "activities" | "medications" | "measurements";
  icon: React.ElementType;
  accent: "orange" | "blue" | "purple";
  href: string;
};

interface UseAnalyticsModulesResult {
  items: AnalyticsItem[];
}

export function useAnalyticsModules(): UseAnalyticsModulesResult {
  const items: AnalyticsItem[] = React.useMemo(
    () => [
      {
        key: "activities",
        icon: Activity,
        accent: "orange",
        href: "/analytics/activities",
      },
      {
        key: "medications",
        icon: Pill,
        accent: "blue",
        href: "/analytics/medications",
      },
      {
        key: "measurements",
        icon: ClipboardList,
        accent: "purple",
        href: "/analytics/measurements",
      },
    ],
    []
  );

  return { items };
}