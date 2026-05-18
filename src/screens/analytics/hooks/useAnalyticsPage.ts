import * as React from "react";
import {
  Activity,
  Pill,
  ClipboardList,
} from "lucide-react";
import { getAllModules } from "../../../api/modulesApi";

export type AnalyticsItem = {
  key: string;
  icon: React.ElementType;
  accent: "orange" | "blue" | "purple" | "gray";
  href: string;
};

interface UseAnalyticsModulesResult {
  items: AnalyticsItem[];
}

const ICONS: Record<string, React.ElementType> = {
  activities: Activity,
  medications: Pill,
  measurements: ClipboardList,
};

const ACCENTS: Record<string, AnalyticsItem["accent"]> = {
  activities: "orange",
  medications: "blue",
  measurements: "purple",
  gray: "gray",
};

const VALID_ROUTES = [
  "/analytics/activities",
  "/analytics/medications",
  "/analytics/measurements",
];

export function useAnalyticsModules(): UseAnalyticsModulesResult {
  const [items, setItems] = React.useState<AnalyticsItem[]>([]);

  React.useEffect(() => {
    let isMounted = true;

    const loadModules = async () => {
      try {
        // משיכת רשימת המודולות הבסיסית (כרטיסיות בלבד, ללא דאטה של גרפים)
        const modules = (await getAllModules()) as { module_name: string }[];

        if (!isMounted) return;

        const mappedItems: AnalyticsItem[] = modules.map((module) => {
          // מנקים רווחים בשביל התרגום הדינמי ב-JSON (למשל file_share)
          const key = module.module_name.toLowerCase().replace(/\s+/g, "_");
          
          // ניתוב מול הראוטר המקומי
          const routeKey = module.module_name.toLowerCase();
          const href = `/analytics/${routeKey}`;

          return {
            key,
            icon: ICONS[key] || ClipboardList,
            accent: ACCENTS[key] || "gray",
            // רק תרופות, מדידות ופעילויות יובילו לעמוד שלהן, השאר ל-not-found
            href: VALID_ROUTES.includes(href) ? href : "/not-found",
          };
        });

        setItems(mappedItems);
      } catch (error) {
        console.error("Failed to load modules for cards", error);
      }
    };

    loadModules();

    return () => {
      isMounted = false;
    };
  }, []);

  return { items };
}