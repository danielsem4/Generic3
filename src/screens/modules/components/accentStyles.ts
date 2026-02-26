import type { ModuleItem } from "../hooks/useModules";

export const ACCENT_STYLES: Record<ModuleItem["accent"], { border: string; iconBg: string; iconText: string }> = {
  green: { border: "border-emerald-200", iconBg: "bg-emerald-50", iconText: "text-emerald-500" },
  purple: { border: "border-violet-200", iconBg: "bg-violet-50", iconText: "text-violet-500" },
  blue: { border: "border-sky-200", iconBg: "bg-sky-50", iconText: "text-sky-500" },
  pink: { border: "border-rose-200", iconBg: "bg-rose-50", iconText: "text-rose-500" },
  orange: { border: "border-amber-200", iconBg: "bg-amber-50", iconText: "text-amber-500" },
};