import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { QComponentType } from "@/common/types/measurement";
import { ToolboxItem } from "./ToolboxItem";

interface ToolboxSectionProps {
  label: string;
  items: {
    type: QComponentType;
    label: string;
    icon: React.ElementType;
  }[];
}

export function ToolboxSection({ label, items }: ToolboxSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  function handleToggle() {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 hover:text-foreground transition-colors"
      >
        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {label}
      </button>
      {isOpen && (
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <ToolboxItem
              key={item.type}
              type={item.type}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
