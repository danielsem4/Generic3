import type { ElementType } from "react";
import {
  LayoutDashboard,
  FileText,
  Ruler,
  MessageCircle,
  Pill,
  Dumbbell,
  Brain,
  Clock,
  Compass,
  Target,
  Zap,
  Stethoscope,
  ClipboardList,
  Radio,
  BarChart3,
  Settings,
  ShoppingCart,
  KeyRound,
  HelpCircle,
} from "lucide-react";

export type ModuleAccent =
  | "emerald"
  | "violet"
  | "sky"
  | "amber"
  | "blue"
  | "orange"
  | "fuchsia"
  | "teal"
  | "indigo"
  | "rose"
  | "cyan"
  | "purple"
  | "lime"
  | "pink"
  | "slate"
  | "zinc"
  | "yellow"
  | "stone";

export interface ModuleConfig {
  icon: ElementType;
  accent: ModuleAccent;
}

const DEFAULT_CONFIG: ModuleConfig = {
  icon: HelpCircle,
  accent: "slate",
};

const MODULE_CONFIG: Record<string, ModuleConfig> = {
  dashboard: { icon: LayoutDashboard, accent: "emerald" },
  "document share": { icon: FileText, accent: "violet" },
  measurements: { icon: Ruler, accent: "sky" },
  chat: { icon: MessageCircle, accent: "amber" },
  medications: { icon: Pill, accent: "blue" },
  activities: { icon: Dumbbell, accent: "orange" },
  memory: { icon: Brain, accent: "fuchsia" },
  cdt: { icon: Clock, accent: "teal" },
  orientation: { icon: Compass, accent: "indigo" },
  hitber: { icon: Target, accent: "rose" },
  tenstreatment: { icon: Zap, accent: "cyan" },
  parkinson: { icon: Stethoscope, accent: "purple" },
  "parkinson report": { icon: ClipboardList, accent: "lime" },
  "parkinson sensors": { icon: Radio, accent: "pink" },
  statistics: { icon: BarChart3, accent: "slate" },
  settings: { icon: Settings, accent: "zinc" },
  "market test": { icon: ShoppingCart, accent: "yellow" },
  pass: { icon: KeyRound, accent: "stone" },
};

export function getModuleConfig(moduleName: string): ModuleConfig {
  return MODULE_CONFIG[moduleName.toLowerCase()] ?? DEFAULT_CONFIG;
}
