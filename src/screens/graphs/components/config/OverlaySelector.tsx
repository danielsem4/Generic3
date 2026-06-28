import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  IGraphOverlay,
  OverlayRender,
  OverlayType,
} from "@/common/types/graph";
import { useGraphElements } from "../../hooks/builder/useGraphElements";

const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30";

const TYPES: { value: OverlayType; labelKey: string }[] = [
  { value: "QUESTION", labelKey: "graphs.overlay.typeQuestion" },
  { value: "MEDICATION", labelKey: "graphs.overlay.typeMedication" },
  { value: "ACTIVITY", labelKey: "graphs.overlay.typeActivity" },
];

const RENDERS: { value: OverlayRender; labelKey: string }[] = [
  { value: "MARKERS", labelKey: "graphs.overlay.renderMarkers" },
  { value: "LINE", labelKey: "graphs.overlay.renderLine" },
];

interface OverlaySelectorProps {
  overlay: IGraphOverlay;
  evaluations: { id: string; name: string }[];
  onChange: (patch: Partial<IGraphOverlay>) => void;
  onRemove: () => void;
  error?: string;
}

export function OverlaySelector({
  overlay,
  evaluations,
  onChange,
  onRemove,
  error,
}: OverlaySelectorProps) {
  const { t } = useTranslation();
  const { elements } = useGraphElements(overlay.evaluationId);
  const isQuestion = overlay.type === "QUESTION";

  function handleTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const type = e.target.value as OverlayType;
    onChange({
      type,
      render: type === "QUESTION" ? overlay.render : "MARKERS",
      evaluationId: undefined,
      elementId: undefined,
      sourceName: undefined,
    });
  }

  function handleRenderChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ render: e.target.value as OverlayRender });
  }

  function handleEvaluationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ evaluationId: e.target.value, elementId: undefined });
  }

  function handleElementChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ elementId: e.target.value });
  }

  function handleSourceNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ sourceName: e.target.value });
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ label: e.target.value });
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ color: e.target.value });
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-2">
        <select
          className={selectClass}
          value={overlay.type}
          onChange={handleTypeChange}
        >
          {TYPES.map((item) => (
            <option key={item.value} value={item.value}>
              {t(item.labelKey)}
            </option>
          ))}
        </select>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          {t("graphs.overlay.remove")}
        </Button>
      </div>

      {isQuestion && (
        <>
          <select
            className={selectClass}
            value={overlay.evaluationId ?? ""}
            onChange={handleEvaluationChange}
          >
            <option value="">{t("graphs.selectQuestionnaire")}</option>
            {evaluations.map((evaluation) => (
              <option key={evaluation.id} value={evaluation.id}>
                {evaluation.name}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={overlay.elementId ?? ""}
            onChange={handleElementChange}
          >
            <option value="">{t("graphs.selectElement")}</option>
            {elements.map((el) => (
              <option key={el.id} value={el.id}>
                {el.label}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={overlay.render}
            onChange={handleRenderChange}
          >
            {RENDERS.map((item) => (
              <option key={item.value} value={item.value}>
                {t(item.labelKey)}
              </option>
            ))}
          </select>
        </>
      )}

      {!isQuestion && (
        <Input
          placeholder={t("graphs.overlay.namePlaceholder")}
          value={overlay.sourceName ?? ""}
          onChange={handleSourceNameChange}
        />
      )}

      <div className="flex items-center gap-3">
        <Input
          placeholder={t("graphs.overlay.labelPlaceholder")}
          value={overlay.label ?? ""}
          onChange={handleLabelChange}
        />
        <div className="flex items-center gap-2">
          <Label className="text-xs">{t("graphs.overlay.colorLabel")}</Label>
          <input
            type="color"
            className="h-9 w-12 cursor-pointer rounded border border-input bg-background"
            value={overlay.color ?? "#ef4444"}
            onChange={handleColorChange}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
