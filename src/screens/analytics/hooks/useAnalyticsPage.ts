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
  isLoading: boolean;
}

const ICONS: Record<string, React.ElementType> = {
  activities: Activity,
  medications: Pill,
  evaluations: ClipboardList,
};

const ACCENTS: Record<string, AnalyticsItem["accent"]> = {
  activities: "orange",
  medications: "blue",
  evaluations: "purple",
  gray: "gray",
};

const VALID_ROUTES = [
  "/analytics/activities",
  "/analytics/medications",
  "/analytics/evaluations",
];

export function useAnalyticsModules(): UseAnalyticsModulesResult {
  const [items, setItems] = React.useState<AnalyticsItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  React.useEffect(() => {
    let isMounted = true;

    const loadModules = async () => {
      try {
        const modules = (await getAllModules()) as { module_name: string }[];

        if (!isMounted) return;

        const mappedItems: AnalyticsItem[] = modules.map((module) => {
          const key = module.module_name.toLowerCase().replace(/\s+/g, "_");
          
          const routeKey = module.module_name.toLowerCase();
          const href = `/analytics/${routeKey}`;

          return {
            key,
            icon: ICONS[key] || ClipboardList,
            accent: ACCENTS[key] || "gray",
            href: VALID_ROUTES.includes(href) ? href : "/not-found",
          };
        });

        setItems(mappedItems);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load modules for cards", error);
        setIsLoading(false);
      }
    };

    loadModules();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
  items,
  isLoading
  };
}