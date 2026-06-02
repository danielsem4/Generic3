import { useToolboxItems } from "../../hooks/toolbox/useToolboxItems";
import { ToolboxSection } from "../toolbox/ToolboxSection";

export function BuilderLeftPanel() {
  const categories = useToolboxItems();

  return (
    <div className="w-64 shrink-0 overflow-y-auto border-r bg-card p-4 space-y-4">
      {categories.map((cat) => (
        <ToolboxSection
          key={cat.category}
          label={cat.label}
          items={cat.items}
        />
      ))}
    </div>
  );
}
