import { useParams } from "react-router-dom";
import { useMeasurementBuilderStore, selectActiveScreenComponents } from "@/store/useMeasurementBuilderStore";
import { findComponentById, getElementPosition } from "../../lib/treeUtils";
import { useVersionSelector } from "../builder/useVersionSelector";
import { useVariantElementMutations } from "../queries/useVariantElementMutations";
import type { IServerElement } from "../../lib/transformStructure";
import type { IVariantElementPayload } from "@/api/measurementsApi";
import type { IQComponent, IQOptionItem } from "@/common/types/measurement";

// ── helpers ──────────────────────────────────────────────────────────────────

export function variantToDisplayValues(
  variant: IServerElement,
  _v1Component: IQComponent,
): Record<string, unknown> {
  const config = variant.config ?? {};
  const ca = variant.correct_answers ?? [];

  // Only return variant-specific overrides — callers spread onto v1 component as base.
  // Never pre-spread v1 here to avoid v1 options leaking when config.options is absent.
  const overrides: Record<string, unknown> = {
    label: variant.label,
    correctAnswerType: variant.correct_answer_type,
    allowPartialScore: variant.allow_partial_score ?? false,
  };

  if (typeof config.placeholder === "string") overrides.placeholder = config.placeholder;

  const rawOpts = config.options;
  if (Array.isArray(rawOpts) && rawOpts.length > 0) {
    const byLabel = new Map(ca.map((a) => [a.answer, a.points]));
    overrides.options = (rawOpts as string[]).map((label) => ({
      label,
      value: label,
      isCorrect: byLabel.has(label),
      score: byLabel.get(label) ?? 0,
    }));
  } else if (ca.length > 0) {
    overrides.correctAnswer = ca[0].answer;
    overrides.grade = ca[0].points;
  }

  return overrides;
}

export function componentToDisplayValues(component: IQComponent): Record<string, unknown> {
  const c = component as Record<string, unknown>;
  const values: Record<string, unknown> = { label: component.label };
  for (const key of [
    "options", "placeholder", "correctAnswerType", "correctAnswer", "grade",
    "allowPartialScore", "min", "max", "minLabel", "maxLabel", "trueLabel", "falseLabel",
  ]) {
    if (key in component) values[key] = c[key];
  }
  return values;
}

function createVersionPlaceholders(component: IQComponent): Record<string, unknown> {
  const c = component as Record<string, unknown>;
  const values: Record<string, unknown> = { label: "" };

  if ("options" in component && Array.isArray(c.options)) {
    values.options = (c.options as IQOptionItem[]).map(() => ({
      label: "",
      value: "",
      isCorrect: false,
      score: 0,
    }));
  }
  if ("placeholder" in component) values.placeholder = "";
  if ("correctAnswerType" in component) values.correctAnswerType = c.correctAnswerType;
  if ("min" in component) values.min = c.min;
  if ("max" in component) values.max = c.max;
  if ("minLabel" in component) values.minLabel = "";
  if ("maxLabel" in component) values.maxLabel = "";
  if ("trueLabel" in component) values.trueLabel = "";
  if ("falseLabel" in component) values.falseLabel = "";

  return values;
}

export function buildCreatePayload(
  values: Record<string, unknown>,
  versionKey: string,
  v1Element: IServerElement,
): IVariantElementPayload {
  const correctAnswerType = (values.correctAnswerType as string) ?? "NONE";
  const options = values.options as IQOptionItem[] | undefined;
  const config: Record<string, unknown> = { ...v1Element.config };

  if (options) config.options = options.map((o) => o.label);
  if (values.placeholder !== undefined) config.placeholder = values.placeholder;

  let correct_answers: { answer: string; points: number }[] | undefined;
  if (correctAnswerType === "STATIC") {
    if (options) {
      const entries = options
        .filter((o) => o.isCorrect)
        .map((o) => ({ answer: o.label, points: o.score ?? 0 }));
      if (entries.length > 0) correct_answers = entries;
    } else if (values.correctAnswer) {
      correct_answers = [
        { answer: values.correctAnswer as string, points: (values.grade as number) ?? 0 },
      ];
    }
  }

  return {
    element_type: v1Element.element_type,
    row_number: v1Element.row_number,
    order_in_row: v1Element.order_in_row,
    version_key: versionKey,
    label: (values.label as string) ?? v1Element.label,
    is_required: v1Element.is_required,
    config,
    correct_answer_type: correctAnswerType,
    correct_answers,
    allow_partial_score: (values.allowPartialScore as boolean) ?? false,
  };
}

export function buildPatchPayload(
  overrides: Record<string, unknown>,
  currentVariant: IServerElement,
): {
  label?: string;
  correct_answer_type?: string;
  correct_answers?: { answer: string; points: number }[];
  allow_partial_score?: boolean;
  config?: Record<string, unknown>;
} {
  const correctAnswerType =
    (overrides.correctAnswerType as string) ?? currentVariant.correct_answer_type;
  const options = overrides.options as IQOptionItem[] | undefined;
  const config: Record<string, unknown> = { ...currentVariant.config };

  if (options) config.options = options.map((o) => o.label);
  if (overrides.placeholder !== undefined) config.placeholder = overrides.placeholder;

  let correct_answers: { answer: string; points: number }[] | undefined;
  if (correctAnswerType === "STATIC") {
    if (options) {
      const entries = options
        .filter((o) => o.isCorrect)
        .map((o) => ({ answer: o.label, points: o.score ?? 0 }));
      if (entries.length > 0) correct_answers = entries;
    } else if (overrides.correctAnswer) {
      correct_answers = [
        { answer: overrides.correctAnswer as string, points: (overrides.grade as number) ?? 0 },
      ];
    } else if (currentVariant.correct_answers?.length) {
      correct_answers = currentVariant.correct_answers as { answer: string; points: number }[];
    }
  }

  return {
    label: (overrides.label as string) ?? undefined,
    correct_answer_type: correctAnswerType,
    correct_answers,
    allow_partial_score: overrides.allowPartialScore as boolean | undefined,
    config,
  };
}

// ── hook ─────────────────────────────────────────────────────────────────────

export function useComponentVersionPanel() {
  const { id: measurementId } = useParams<{ id: string }>();

  const selectedComponentId = useMeasurementBuilderStore((s) => s.selectedComponentId);
  const panelVersionKey = useMeasurementBuilderStore((s) => s.panelVersionKey);
  const setPanelVersionKey = useMeasurementBuilderStore((s) => s.setPanelVersionKey);
  const localNewVersion = useMeasurementBuilderStore((s) => s.localNewVersion);
  const setLocalNewVersion = useMeasurementBuilderStore((s) => s.setLocalNewVersion);
  const draftsByVersion = useMeasurementBuilderStore((s) => s.draftsByVersion);
  const patchDraftOverride = useMeasurementBuilderStore((s) => s.patchDraftOverride);
  const clearDraftForVersion = useMeasurementBuilderStore((s) => s.clearDraftForVersion);
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);

  const found = selectedComponentId
    ? findComponentById(components, selectedComponentId)
    : undefined;
  const selectedComponent = found?.component ?? null;

  const draftOverrides = draftsByVersion[panelVersionKey] ?? {};

  const {
    versions,
    getVariantForComponent,
    getV1ElementForComponent,
    getVariantCountForComponent,
  } = useVersionSelector();

  const { createVariant, updateVariant, publishVariant, isCreating, isUpdating, isPublishing } =
    useVariantElementMutations(measurementId);

  const v1Element = selectedComponentId
    ? getV1ElementForComponent(selectedComponentId)
    : undefined;

  const currentVariant =
    selectedComponentId && panelVersionKey !== "v1"
      ? getVariantForComponent(selectedComponentId, panelVersionKey)
      : undefined;

  const isLocalNewVersion = localNewVersion?.key === panelVersionKey;

  // Server versions for this component (v1 + those with actual variants)
  const baseVersions = selectedComponentId
    ? versions.filter(
        (vk) => vk === "v1" || !!getVariantForComponent(selectedComponentId, vk),
      )
    : ["v1"];

  // Include locally branched version in dropdown even before save
  const componentVersions =
    localNewVersion && !baseVersions.includes(localNewVersion.key)
      ? [...baseVersions, localNewVersion.key]
      : baseVersions;

  const isReadOnly = false;

  // Display values: local branch source → merged with draft overrides
  const baseDisplayValues: Record<string, unknown> | null = isLocalNewVersion
    ? (localNewVersion?.sourceValues ?? null)
    : currentVariant && selectedComponent
      ? variantToDisplayValues(currentVariant, selectedComponent)
      : null;

  const variantDisplayValues = baseDisplayValues
    ? { ...baseDisplayValues, ...draftOverrides }
    : null;

  // Save button is active if: local new version (always saveable) or has overrides
  const hasDraftChanges = isLocalNewVersion || Object.keys(draftOverrides).length > 0;

  const totalVariantCount = selectedComponentId
    ? getVariantCountForComponent(selectedComponentId)
    : 0;

  // ── handlers ──────────────────────────────────────────────────────────────

  function handleDraftChange(key: string, value: unknown) {
    patchDraftOverride(panelVersionKey, key, value);
  }

  function handleBranchNewVersion() {
    if (!selectedComponentId || !selectedComponent) return;

    const existingNums = componentVersions
      .filter((vk) => /^v\d+$/.test(vk))
      .map((vk) => parseInt(vk.slice(1), 10));
    const next = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 2;
    const newKey = `v${next}`;

    const sourceValues = createVersionPlaceholders(selectedComponent);

    if (v1Element) {
      setLocalNewVersion({ key: newKey, sourceValues, v1ServerId: v1Element.id });
    } else {
      const store = useMeasurementBuilderStore.getState();
      const pos = getElementPosition(store.screens, store.activeScreenIndex, selectedComponentId);
      setLocalNewVersion({
        key: newKey,
        sourceValues,
        screenNumber: store.activeScreenIndex + 1,
        rowNumber: pos?.rowNumber,
        orderInRow: pos?.orderInRow ?? 1,
      });
    }
    setPanelVersionKey(newKey);
  }

  async function handleSaveDraft() {
    if (!v1Element) return;

    if (isLocalNewVersion && localNewVersion) {
      // First-ever save for this branched version → POST to create
      const mergedValues = { ...localNewVersion.sourceValues, ...draftOverrides };
      await createVariant({
        screenNumber: v1Element._screenNumber ?? 1,
        payload: buildCreatePayload(mergedValues, localNewVersion.key, v1Element),
      });
      setLocalNewVersion(null);
      clearDraftForVersion(localNewVersion.key);
    } else if (currentVariant && Object.keys(draftOverrides).length > 0) {
      // Existing saved variant → PATCH
      await updateVariant({
        screenNumber: v1Element._screenNumber ?? 1,
        elementId: currentVariant.id,
        payload: buildPatchPayload(draftOverrides, currentVariant),
      });
      clearDraftForVersion(panelVersionKey);
    }
  }

  async function handlePublish() {
    if (!v1Element) return;

    if (isLocalNewVersion && localNewVersion) {
      // Not saved yet — POST then publish
      const mergedValues = { ...localNewVersion.sourceValues, ...draftOverrides };
      const created = await createVariant({
        screenNumber: v1Element._screenNumber ?? 1,
        payload: buildCreatePayload(mergedValues, localNewVersion.key, v1Element),
      });
      setLocalNewVersion(null);
      clearDraftForVersion(localNewVersion.key);
      await publishVariant({
        screenNumber: v1Element._screenNumber ?? 1,
        elementId: created.id,
      });
    } else {
      // Already saved — save pending overrides then publish
      if (Object.keys(draftOverrides).length > 0 && currentVariant) {
        await updateVariant({
          screenNumber: v1Element._screenNumber ?? 1,
          elementId: currentVariant.id,
          payload: buildPatchPayload(draftOverrides, currentVariant),
        });
        clearDraftForVersion(panelVersionKey);
      }
      if (currentVariant) {
        await publishVariant({
          screenNumber: v1Element._screenNumber ?? 1,
          elementId: currentVariant.id,
        });
      }
    }
  }

  return {
    selectedComponent,
    panelVersionKey,
    componentVersions,
    isReadOnly,
    currentVariant,
    isLocalNewVersion,
    v1Element,
    variantDisplayValues,
    draftOverrides,
    hasDraftChanges,
    totalVariantCount,
    setPanelVersionKey,
    handleDraftChange,
    handleBranchNewVersion,
    handleSaveDraft,
    handlePublish,
    isCreating,
    isUpdating,
    isPublishing,
  };
}
