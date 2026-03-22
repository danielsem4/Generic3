import type { ModuleAccent } from "../moduleConfig";

export const ACCENT_STYLES: Record<ModuleAccent, { border: string; iconBg: string; iconText: string }> = {
  emerald: { border: "border-emerald-200", iconBg: "bg-emerald-50", iconText: "text-emerald-500" },
  violet: { border: "border-violet-200", iconBg: "bg-violet-50", iconText: "text-violet-500" },
  sky: { border: "border-sky-200", iconBg: "bg-sky-50", iconText: "text-sky-500" },
  amber: { border: "border-amber-200", iconBg: "bg-amber-50", iconText: "text-amber-500" },
  blue: { border: "border-sky-200", iconBg: "bg-sky-50", iconText: "text-sky-500" },
  orange: { border: "border-amber-200", iconBg: "bg-amber-50", iconText: "text-amber-500" },
  fuchsia: { border: "border-fuchsia-200", iconBg: "bg-fuchsia-50", iconText: "text-fuchsia-500" },
  teal: { border: "border-teal-200", iconBg: "bg-teal-50", iconText: "text-teal-500" },
  indigo: { border: "border-indigo-200", iconBg: "bg-indigo-50", iconText: "text-indigo-500" },
  rose: { border: "border-rose-200", iconBg: "bg-rose-50", iconText: "text-rose-500" },
  cyan: { border: "border-cyan-200", iconBg: "bg-cyan-50", iconText: "text-cyan-500" },
  purple: { border: "border-purple-200", iconBg: "bg-purple-50", iconText: "text-purple-500" },
  lime: { border: "border-lime-200", iconBg: "bg-lime-50", iconText: "text-lime-500" },
  pink: { border: "border-pink-200", iconBg: "bg-pink-50", iconText: "text-pink-500" },
  slate: { border: "border-slate-200", iconBg: "bg-slate-50", iconText: "text-slate-500" },
  zinc: { border: "border-zinc-200", iconBg: "bg-zinc-50", iconText: "text-zinc-500" },
  yellow: { border: "border-yellow-200", iconBg: "bg-yellow-50", iconText: "text-yellow-500" },
  stone: { border: "border-stone-200", iconBg: "bg-stone-50", iconText: "text-stone-500" },
};
