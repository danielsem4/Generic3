import { ChevronRight } from "lucide-react";
import type { ISectionItem } from "@/common/types/section";

interface Props {
  readonly item: ISectionItem;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly iconClassName: string;
  readonly onClick?: () => void;
}

export default function SectionItem({
  item,
  icon: Icon,
  iconClassName,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-md border bg-muted/30 p-3 transition hover:bg-muted ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-6 w-6 items-center justify-center text-muted-foreground">
          <Icon className={`h-4 w-4 ${iconClassName}`} />
        </div>
        <span className="text-sm font-medium">{item.label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}
