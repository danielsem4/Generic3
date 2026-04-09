import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IQOptionItem } from "@/common/types/questionnaire";

interface OptionsListEditorProps {
  options: IQOptionItem[];
  onChange: (options: IQOptionItem[]) => void;
}

export function OptionsListEditor({
  options,
  onChange,
}: OptionsListEditorProps) {
  const { t } = useTranslation();

  function handleLabelChange(index: number, label: string) {
    const updated = options.map((opt, i) =>
      i === index ? { ...opt, label, value: label.toLowerCase().replace(/\s+/g, "_") } : opt,
    );
    onChange(updated);
  }

  function handleAdd() {
    const num = options.length + 1;
    onChange([...options, { label: `Option ${num}`, value: `option${num}` }]);
  }

  function handleRemove(index: number) {
    onChange(options.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {options.map((opt, index) => (
        <div key={index} className="flex items-center gap-1">
          <Input
            value={opt.label}
            onChange={(e) => handleLabelChange(index, e.target.value)}
            className="h-7 text-xs flex-1"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full h-7 text-xs gap-1"
      >
        <Plus size={12} />
        {t("questionnaires.props.addOption")}
      </Button>
    </div>
  );
}
