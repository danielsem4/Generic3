import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import type { QComponentType } from "@/common/types/measurement";
import { componentRegistry } from "../../lib/componentRegistry";

interface ComponentTypeBadgeProps {
  type: QComponentType;
}

export function ComponentTypeBadge({ type }: ComponentTypeBadgeProps) {
  const { t } = useTranslation();
  const entry = componentRegistry[type];
  const Icon = entry.icon;

  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      <Icon size={12} />
      {t(entry.labelKey)}
    </Badge>
  );
}
