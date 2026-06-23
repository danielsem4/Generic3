import type { IGraph } from "@/common/types/graph";
import { cn } from "@/lib/utils";

interface GraphListItemProps {
  graph: IGraph;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function GraphListItem({
  graph,
  isSelected,
  onSelect,
}: GraphListItemProps) {
  const handleClick = () => onSelect(graph.id);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "w-full rounded-xl px-4 py-3 text-start text-sm font-medium transition-colors",
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 text-foreground hover:bg-muted",
      )}
    >
      {graph.name}
    </button>
  );
}
