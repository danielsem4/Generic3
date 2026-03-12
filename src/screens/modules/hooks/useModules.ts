import type { ElementType } from "react";
import {
  GraduationCap,
  ClipboardList,
  Pill,
  Radio,
  Activity,
} from "lucide-react";

export type ModuleItem = {
  key: "exams" | "questionnaires" | "medications" | "sensors" | "activities";
  icon: ElementType;
  accent: "green" | "purple" | "blue" | "pink" | "orange";
  href: string;
  gridClassName?: string;
};

interface UseModulesResult {
  items: ModuleItem[];
}



export function useModules(): UseModulesResult {
  const items: ModuleItem[] = [
    { key: "exams", icon: GraduationCap, accent: "green", href: "/modules/exams" },
    { key: "questionnaires", icon: ClipboardList, accent: "purple", href: "/modules/questionnaires" },
    { key: "medications", icon: Pill, accent: "blue", href: "/modules/medications" },
    { key: "sensors", icon: Radio, accent: "pink", href: "/modules/sensors", gridClassName: "lg:col-start-2" },
    { key: "activities", icon: Activity, accent: "orange", href: "/modules/activities", gridClassName: "lg:col-start-3" },
  ];

  return { items };
}