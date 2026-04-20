import { useTranslation } from "react-i18next";
import type {
  QComponentType,
  QComponentCategory,
  MeasurementType,
} from "@/common/types/measurement";
import { componentRegistry } from "../../lib/componentRegistry";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";

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

const standardCategoryOrder: QComponentCategory[] = [
  "textDisplay",
  "userInputs",
  "actions",
  "structure",
];

const cognitiveCategoryOrder: QComponentCategory[] = ["cognitiveFields"];

export function useToolboxItems(): ToolboxCategory[] {
  const { t } = useTranslation();
  const activeMeasurementId = useMeasurementBuilderStore((s) => s.activeMeasurementId);
  const measurements = useMeasurementBuilderStore((s) => s.measurements);

  const measurementType: MeasurementType | undefined = measurements.find(
    (m) => m.id === activeMeasurementId,
  )?.type;

  const isCognitive = measurementType === "COGNITIVE_TESTS";
  const categoryOrder = isCognitive ? cognitiveCategoryOrder : standardCategoryOrder;

  const grouped = new Map<QComponentCategory, ToolboxItem[]>();

  for (const [type, entry] of Object.entries(componentRegistry)) {
    const category = entry.category;
    if (isCognitive && category !== "cognitiveFields") continue;
    if (!isCognitive && category === "cognitiveFields") continue;
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
