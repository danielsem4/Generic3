import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { AxisSource, IAxisConfig } from "@/common/types/graph";
import type { IGraphElement } from "../../hooks/builder/useGraphElements";

const SOURCES: { value: AxisSource; labelKey: string }[] = [
  { value: "SUBMISSION_DATE", labelKey: "graphs.axisSource.submissionDate" },
  { value: "SUBMISSION_SCORE", labelKey: "graphs.axisSource.submissionScore" },
  { value: "ELEMENT_ANSWER", labelKey: "graphs.axisSource.elementAnswer" },
];

const selectClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/30";

interface AxisSelectorProps {
  title: string;
  axis: IAxisConfig;
  elements: IGraphElement[];
  onChange: (patch: Partial<IAxisConfig>) => void;
  error?: string;
}

export function AxisSelector({
  title,
  axis,
  elements,
  onChange,
  error,
}: AxisSelectorProps) {
  const { t } = useTranslation();

  function handleSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ source: e.target.value as AxisSource });
  }

  function handleElementChange(e: React.ChangeEvent<HTMLSelectElement>) {
    onChange({ elementId: e.target.value });
  }

  function handleLabelChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ label: e.target.value });
  }

  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
      <Label>{title}</Label>
      <select
        className={selectClass}
        value={axis.source}
        onChange={handleSourceChange}
      >
        {SOURCES.map((s) => (
          <option key={s.value} value={s.value}>
            {t(s.labelKey)}
          </option>
        ))}
      </select>

      {axis.source === "ELEMENT_ANSWER" && (
        <select
          className={selectClass}
          value={axis.elementId ?? ""}
          onChange={handleElementChange}
        >
          <option value="">{t("graphs.selectElement")}</option>
          {elements.map((el) => (
            <option key={el.id} value={el.id}>
              {el.label}
            </option>
          ))}
        </select>
      )}

      <div className="space-y-2">
        <Label>{t("graphs.axisLabelLabel")}</Label>
        <Input
          placeholder={t("graphs.axisLabelPlaceholder")}
          value={axis.label ?? ""}
          onChange={handleLabelChange}
        />
      </div>

      {error && <p className="text-sm text-destructive">{t(error)}</p>}
    </div>
  );
}
