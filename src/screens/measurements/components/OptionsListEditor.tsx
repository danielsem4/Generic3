import { useTranslation } from "react-i18next";
import { Plus, Trash2, Circle, CheckCircle2, Square, CheckSquare2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IQOptionItem, QComponentType, CorrectAnswerType } from "@/common/types/measurement";
import { useOptionScoring } from "../hooks/useOptionScoring";

interface OptionsListEditorProps {
  options: IQOptionItem[];
  onChange: (options: IQOptionItem[]) => void;
  correctAnswerType?: CorrectAnswerType;
  componentType?: QComponentType;
}

export function OptionsListEditor({
  options,
  onChange,
  correctAnswerType,
  componentType,
}: OptionsListEditorProps) {
  const { t } = useTranslation();
  const showScoring = correctAnswerType === "STATIC" && !!componentType;
  const { handleToggleCorrect, handleScoreChange, totalScore } =
    useOptionScoring(options, componentType ?? "dropdown", onChange);

  const isMulti = componentType === "multiSelect";

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
          {showScoring && (
            <button
              type="button"
              onClick={() => handleToggleCorrect(index)}
              className="shrink-0 p-0.5 text-muted-foreground hover:text-primary transition-colors"
            >
              {opt.isCorrect
                ? (isMulti ? <CheckSquare2 size={14} className="text-primary" /> : <CheckCircle2 size={14} className="text-primary" />)
                : (isMulti ? <Square size={14} /> : <Circle size={14} />)}
            </button>
          )}
          <Input
            value={opt.label}
            onChange={(e) => handleLabelChange(index, e.target.value)}
            className="h-7 text-xs flex-1"
          />
          {showScoring && opt.isCorrect && (
            <Input
              type="number"
              min={0}
              value={opt.score ?? 0}
              onChange={(e) => handleScoreChange(index, Number(e.target.value))}
              className="h-7 text-xs w-16 shrink-0"
              placeholder={t("measurements.props.optionScore")}
            />
          )}
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
        {t("measurements.props.addOption")}
      </Button>
      {showScoring && totalScore > 0 && (
        <div className="text-xs text-muted-foreground text-right">
          {t("measurements.props.totalScore")}: {totalScore}
        </div>
      )}
    </div>
  );
}
