import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { OptionsListEditor } from "../property-editor/OptionsListEditor";
import type { IServerElement } from "../../lib/transformStructure";
import type { IQOptionItem, QComponentType, CorrectAnswerType } from "@/common/types/measurement";
import { useVersionContext } from "./VersionContext";

const BACKEND_TO_FRONTEND: Record<string, QComponentType> = {
  INPUT_SELECT: "dropdown",
  INPUT_MULTI_SELECT: "multiSelect",
  INPUT_RADIO: "radioGroup",
};

const OPTION_BASED_BACKEND = new Set([
  "INPUT_SELECT",
  "INPUT_MULTI_SELECT",
  "INPUT_RADIO",
]);

interface VariantElementFormProps {
  v1Element: IServerElement;
  existingVariant: IServerElement | undefined;
  versionKey: string;
  screenNumber: number;
  onDone: () => void;
}

function optionsFromElement(el: IServerElement): IQOptionItem[] {
  const raw = el.config?.options;
  if (!Array.isArray(raw)) return [];
  return (raw as string[]).map((label) => ({ id: crypto.randomUUID(), label, value: label }));
}

function applyCorrectAnswers(
  options: IQOptionItem[],
  el: IServerElement,
): IQOptionItem[] {
  const answers = el.correct_answers ?? [];
  if (answers.length === 0) return options;
  const byLabel = new Map(
    answers.filter((a) => a.answer !== "").map((a) => [a.answer, a.points]),
  );
  return options.map((o) =>
    o.label && byLabel.has(o.label)
      ? { ...o, isCorrect: true, score: byLabel.get(o.label) ?? 0 }
      : o,
  );
}

export function VariantElementForm({
  v1Element,
  existingVariant,
  versionKey,
  screenNumber,
  onDone,
}: VariantElementFormProps) {
  const { t } = useTranslation();
  const { createVariant, updateVariant, isCreating, isUpdating } =
    useVersionContext();

  const source = existingVariant ?? v1Element;
  const isOptionBased = OPTION_BASED_BACKEND.has(v1Element.element_type);

  const [label, setLabel] = useState(source.label);
  const [correctAnswerType, setCorrectAnswerType] = useState<CorrectAnswerType>(
    source.correct_answer_type,
  );
  const frontendType = BACKEND_TO_FRONTEND[v1Element.element_type];
  const [allowPartial, setAllowPartial] = useState(
    source.allow_partial_score ?? false,
  );
  const [options, setOptions] = useState<IQOptionItem[]>(() => {
    if (!isOptionBased) return [];
    const base = optionsFromElement(source);
    return correctAnswerType === "STATIC"
      ? applyCorrectAnswers(base, source)
      : base;
  });
  const [scalarAnswer, setScalarAnswer] = useState(
    source.correct_answers?.[0]?.answer ?? "",
  );
  const [scalarGrade, setScalarGrade] = useState(
    source.correct_answers?.[0]?.points ?? 0,
  );

  const isBusy = isCreating || isUpdating;

  function buildConfig(): Record<string, unknown> {
    if (!isOptionBased) return { ...v1Element.config };
    const base = { ...v1Element.config, options: options.map((o) => o.label) };
    const displayStyle = (v1Element.config?.display_style as string) ?? "";
    if (displayStyle) base.display_style = displayStyle;
    return base;
  }

  function buildCorrectAnswers() {
    if (correctAnswerType === "NONE") return undefined;
    if (isOptionBased && correctAnswerType === "STATIC") {
      const entries = options
        .filter((o) => o.isCorrect)
        .map((o) => ({ answer: o.label, points: o.score ?? 0 }));
      return entries.length > 0 ? entries : undefined;
    }
    if (!isOptionBased && correctAnswerType === "STATIC" && scalarAnswer.trim()) {
      return [{ answer: scalarAnswer.trim(), points: scalarGrade }];
    }
    return undefined;
  }

  async function handleSave() {
    const config = buildConfig();
    const correctAnswers = buildCorrectAnswers();

    try {
      if (existingVariant) {
        await updateVariant({
          screenNumber,
          elementId: existingVariant.id,
          payload: {
            label,
            correct_answer_type: correctAnswerType,
            correct_answers: correctAnswers,
            allow_partial_score: allowPartial,
            config,
          },
        });
        toast.success(t("measurements.builder.versions.variantUpdated"));
      } else {
        await createVariant({
          screenNumber,
          payload: {
            element_type: v1Element.element_type,
            row_number: v1Element.row_number,
            order_in_row: v1Element.order_in_row,
            version_key: versionKey,
            label,
            is_required: v1Element.is_required,
            config,
            correct_answer_type: correctAnswerType,
            correct_answers: correctAnswers,
            allow_partial_score: allowPartial,
          },
        });
        toast.success(t("measurements.builder.versions.variantCreated"));
      }
      onDone();
    } catch {
      toast.error(t("measurements.builder.versions.variantSaveError"));
    }
  }

  return (
    <div className="mt-2 rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-primary">
          {t("measurements.builder.versions.editVariant", { version: versionKey })}
        </span>
        <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
          {v1Element.element_type}
        </span>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t("measurements.builder.versions.variantLabel")}</Label>
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">{t("measurements.builder.versions.answerType")}</Label>
        <select
          value={correctAnswerType}
          onChange={(e) =>
            setCorrectAnswerType(
              e.target.value as "NONE" | "STATIC" | "DYNAMIC",
            )
          }
          className="h-8 w-full rounded-md border bg-background px-2 text-sm"
        >
          <option value="NONE">None</option>
          <option value="STATIC">Static</option>
          <option value="DYNAMIC">Dynamic</option>
        </select>
      </div>

      {!isOptionBased && correctAnswerType === "STATIC" && (
        <div className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">{t("measurements.builder.versions.variantLabel")}</Label>
            <Input
              value={scalarAnswer}
              onChange={(e) => setScalarAnswer(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="w-20 space-y-1">
            <Label className="text-xs">Pts</Label>
            <Input
              type="number"
              value={scalarGrade}
              onChange={(e) => setScalarGrade(Number(e.target.value))}
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}

      {isOptionBased && (
        <div className="space-y-1">
          <Label className="text-xs">{t("measurements.builder.versions.options")}</Label>
          <OptionsListEditor
            options={options}
            onChange={setOptions}
            correctAnswerType={correctAnswerType}
            componentType={frontendType}
          />
        </div>
      )}

      {isOptionBased &&
        v1Element.element_type === "INPUT_MULTI_SELECT" &&
        correctAnswerType === "STATIC" && (
          <div className="flex items-center justify-between">
            <Label className="text-xs">
              {t("measurements.builder.versions.allowPartial")}
            </Label>
            <Switch checked={allowPartial} onCheckedChange={setAllowPartial} />
          </div>
        )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={onDone} disabled={isBusy}>
          {t("common.cancel")}
        </Button>
        <Button size="sm" onClick={handleSave} disabled={isBusy}>
          {isBusy ? t("common.loading") : t("common.save")}
        </Button>
      </div>
    </div>
  );
}
