import { useTranslation } from "react-i18next";
import type {
  QComponentType,
  QComponentCategory,
} from "@/common/types/measurement";
import { componentRegistry } from "../lib/componentRegistry";

interface ToolboxItem {
  type: QComponentType;
  label: string;
  icon: React.ElementType;
}

interface ToolboxCategory {
  category: QComponentCategory;
  label: string;
  items: ToolboxItem[];
}

const categoryOrder: QComponentCategory[] = [
  "textDisplay",
  "userInputs",
  "actions",
  "structure",
];

export function useToolboxItems(): ToolboxCategory[] {
  const { t } = useTranslation();

  const grouped = new Map<QComponentCategory, ToolboxItem[]>();

  for (const [type, entry] of Object.entries(componentRegistry)) {
    const category = entry.category;
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push({
      type: type as QComponentType,
      label: t(entry.labelKey),
      icon: entry.icon,
    });
  }

  return categoryOrder
    .filter((cat) => grouped.has(cat))
    .map((cat) => ({
      category: cat,
      label: t(`measurements.categories.${cat}`),
      items: grouped.get(cat)!,
    }));
}
