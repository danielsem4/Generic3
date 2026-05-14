import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IQVisualSpot } from "@/common/types/measurement";

const BODY_MAP_POINTS = [
  "Head",
  "Neck",
  "Chest",
  "Belly",
  "Upper Back",
  "Lower Back",
  "Buttocks",
  "Left Shoulder",
  "Right Shoulder",
  "Left Arm",
  "Right Arm",
  "Left Knee",
  "Right Knee",
  "Left Foot",
  "Right Foot",
] as const;

interface SpotsListEditorProps {
  spots: IQVisualSpot[];
  onChange: (spots: IQVisualSpot[]) => void;
}

export function SpotsListEditor({ spots, onChange }: SpotsListEditorProps) {
  const { t } = useTranslation();

  const usedPoints = new Set(spots.map((s) => s.point));
  const availablePoints = BODY_MAP_POINTS.filter((p) => !usedPoints.has(p));

  function handlePointChange(index: number, point: string) {
    onChange(spots.map((s, i) => (i === index ? { ...s, point } : s)));
  }

  function handleSubItemChange(spotIndex: number, subIndex: number, value: string) {
    onChange(
      spots.map((s, i) =>
        i === spotIndex
          ? { ...s, subItems: s.subItems.map((sub, j) => (j === subIndex ? value : sub)) }
          : s,
      ),
    );
  }

  function handleAddSubItem(spotIndex: number) {
    onChange(
      spots.map((s, i) =>
        i === spotIndex ? { ...s, subItems: [...s.subItems, ""] } : s,
      ),
    );
  }

  function handleRemoveSubItem(spotIndex: number, subIndex: number) {
    onChange(
      spots.map((s, i) =>
        i === spotIndex
          ? { ...s, subItems: s.subItems.filter((_, j) => j !== subIndex) }
          : s,
      ),
    );
  }

  function handleAddSpot() {
    if (availablePoints.length === 0) return;
    onChange([...spots, { point: availablePoints[0], subItems: [] }]);
  }

  function handleRemoveSpot(index: number) {
    onChange(spots.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {spots.map((spot, spotIndex) => {
        const selectablePoints = BODY_MAP_POINTS.filter(
          (p) => p === spot.point || !usedPoints.has(p),
        );
        return (
          <div key={spotIndex} className="rounded-md border p-2 space-y-2">
            <div className="flex items-center gap-1">
              <select
                value={spot.point}
                onChange={(e) => handlePointChange(spotIndex, e.target.value)}
                className="h-7 flex-1 rounded-md border border-input bg-background px-2 text-xs font-mono"
              >
                {selectablePoints.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleRemoveSpot(spotIndex)}
                className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>

            <div className="space-y-1 pl-2">
              {spot.subItems.map((sub, subIndex) => (
                <div key={subIndex} className="flex items-center gap-1">
                  <Input
                    value={sub}
                    onChange={(e) => handleSubItemChange(spotIndex, subIndex, e.target.value)}
                    className="h-6 text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubItem(spotIndex, subIndex)}
                    className="shrink-0 p-0.5 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleAddSubItem(spotIndex)}
                className="h-6 text-xs gap-1 px-2"
              >
                <Plus size={10} />
                {t("measurements.props.addSubitem")}
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddSpot}
        disabled={availablePoints.length === 0}
        className="w-full h-7 text-xs gap-1"
      >
        <Plus size={12} />
        {t("measurements.props.addSpot")}
      </Button>
    </div>
  );
}
