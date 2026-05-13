import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";
import { useMeasurementsQuery } from "../queries/useMeasurementsQuery";
import { useMeasurementStructureQuery } from "../queries/useMeasurementStructureQuery";
import { useSaveMeasurementStructure } from "../queries/useSaveMeasurementStructure";
import {
  transformPayloadToScreens,
  transformScreensToPayload,
  buildVersionStructurePayload,
  type IServerElement,
  type IServerStructureResponse,
  type VersionElementOverride,
} from "../../lib/transformStructure";
import {
  fetchMeasurementStructure,
  createVariantElement,
  updateVariantElement,
} from "@/api/measurementsApi";
import {
  buildCreatePayload,
  buildPatchPayload,
} from "../canvas/useComponentVersionPanel";

function findV1ById(
  structure: IServerStructureResponse,
  serverId: string,
): { element: IServerElement; screenNumber: number } | undefined {
  for (const screen of structure.screens) {
    for (const row of screen.rows) {
      const el = row.elements.find(
        (e) => e.id === serverId && (e.version_key ?? "v1") === "v1",
      );
      if (el) return { element: el, screenNumber: screen.screen_number };
    }
  }
  return undefined;
}

function findV1ByPosition(
  structure: IServerStructureResponse,
  screenNumber: number,
  rowNumber: number,
  orderInRow: number,
): { element: IServerElement; screenNumber: number } | undefined {
  const screen = structure.screens.find((s) => s.screen_number === screenNumber);
  if (!screen) return undefined;
  const row = screen.rows.find((r) => r.row_number === rowNumber);
  if (!row) return undefined;
  const el = row.elements.find(
    (e) => e.order_in_row === orderInRow && (e.version_key ?? "v1") === "v1",
  );
  if (!el) return undefined;
  return { element: el, screenNumber: screen.screen_number };
}

function findVariantElement(
  structure: IServerStructureResponse,
  v1Element: IServerElement,
  versionKey: string,
  screenNumber: number,
): IServerElement | undefined {
  const screen = structure.screens.find((s) => s.screen_number === screenNumber);
  const row = screen?.rows.find((r) => r.row_number === v1Element.row_number);
  return row?.elements.find((e) => (e.version_key ?? "v1") === versionKey);
}

export function useMeasurementBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);
  const queryClient = useQueryClient();

  const { data: fetchedMeasurements } = useMeasurementsQuery(clinicId);
  const {
    data: structureData,
    isLoading: isLoadingStructureQuery,
  } = useMeasurementStructureQuery(id);

  const hydrateScreens = useMeasurementBuilderStore((s) => s.hydrateScreens);
  const setHasSubmissions = useMeasurementBuilderStore((s) => s.setHasSubmissions);
  const hasSubmissions = useMeasurementBuilderStore((s) => s.hasSubmissions);
  const saveCurrentMeasurement = useMeasurementBuilderStore(
    (s) => s.saveCurrentMeasurement,
  );
  const clearCanvas = useMeasurementBuilderStore((s) => s.clearCanvas);
  const isPreviewMode = useMeasurementBuilderStore((s) => s.isPreviewMode);
  const setPreviewMode = useMeasurementBuilderStore((s) => s.setPreviewMode);
  const activeMeasurementId = useMeasurementBuilderStore(
    (s) => s.activeMeasurementId,
  );
  const measurements = useMeasurementBuilderStore((s) => s.measurements);
  const screens = useMeasurementBuilderStore((s) => s.screens);
  const isDirty = useMeasurementBuilderStore((s) => s.isDirty);

  const { saveStructure, isSaving } = useSaveMeasurementStructure();

  const activeMeasurement = measurements.find(
    (q) => q.id === activeMeasurementId,
  );

  useEffect(() => {
    if (!id || !fetchedMeasurements) return;

    const store = useMeasurementBuilderStore.getState();
    if (store.activeMeasurementId === id) return;

    const measurement = fetchedMeasurements.find((m) => m.id === id);
    if (!measurement) return;

    if (!store.measurements.some((m) => m.id === id)) {
      store.addMeasurement(measurement);
    }
    store.loadMeasurement(id);
  }, [id, fetchedMeasurements]);

  useEffect(() => {
    if (!id || !structureData) return;

    const store = useMeasurementBuilderStore.getState();
    if (store.activeMeasurementId !== id) return;
    if (store.isDirty) return;

    const serverScreens = transformPayloadToScreens(structureData);
    hydrateScreens(serverScreens);
    setHasSubmissions(structureData.has_submissions ?? false);
  }, [id, structureData, hydrateScreens, setHasSubmissions]);

  const isLoadingStructure = !!id && isLoadingStructureQuery;

  async function handleSave() {
    if (!activeMeasurementId || !clinicId) return;

    if (hasSubmissions) {
      await handleSaveLocked(activeMeasurementId, clinicId);
      return;
    }

    const { localNewVersion, draftsByVersion, selectedComponentId, panelVersionKey } =
      useMeasurementBuilderStore.getState();
    const draftOverrides = draftsByVersion[panelVersionKey] ?? {};

    const hasPendingNewVariant = !!localNewVersion;
    const hasPendingDraftOverride =
      !localNewVersion &&
      panelVersionKey !== "v1" &&
      !!selectedComponentId &&
      Object.keys(draftOverrides).length > 0;

    try {
      const payload = transformScreensToPayload(screens);
      await saveStructure({ measurementId: activeMeasurementId, payload });

      if (hasPendingNewVariant || hasPendingDraftOverride) {
        const fresh = await fetchMeasurementStructure(clinicId, activeMeasurementId);

        if (hasPendingNewVariant && localNewVersion) {
          let v1Result: { element: IServerElement; screenNumber: number } | undefined;

          if (localNewVersion.v1ServerId) {
            v1Result = findV1ById(fresh, localNewVersion.v1ServerId);
          } else if (localNewVersion.screenNumber && localNewVersion.rowNumber) {
            v1Result = findV1ByPosition(
              fresh,
              localNewVersion.screenNumber,
              localNewVersion.rowNumber,
              localNewVersion.orderInRow ?? 1,
            );
          }

          if (v1Result) {
            const merged = { ...localNewVersion.sourceValues, ...draftOverrides };
            await createVariantElement(
              clinicId,
              activeMeasurementId,
              v1Result.screenNumber,
              buildCreatePayload(merged, localNewVersion.key, v1Result.element),
            );
          }

          useMeasurementBuilderStore.getState().setLocalNewVersion(null);
          useMeasurementBuilderStore.getState().clearDraftForVersion(localNewVersion.key);
        } else if (hasPendingDraftOverride && selectedComponentId) {
          let v1El: IServerElement | undefined;
          let variantScreenNumber: number | undefined;

          for (const screen of fresh.screens) {
            for (const row of screen.rows) {
              const el = row.elements.find(
                (e) => e.id === selectedComponentId && (e.version_key ?? "v1") === "v1",
              );
              if (el) { v1El = el; variantScreenNumber = screen.screen_number; break; }
            }
            if (v1El) break;
          }

          if (v1El && variantScreenNumber) {
            const variantEl = findVariantElement(fresh, v1El, panelVersionKey, variantScreenNumber);
            if (variantEl) {
              await updateVariantElement(
                clinicId,
                activeMeasurementId,
                variantScreenNumber,
                variantEl.id,
                buildPatchPayload(draftOverrides, variantEl),
              );
            }
            useMeasurementBuilderStore.getState().clearDraftForVersion(panelVersionKey);
          }
        }

        queryClient.invalidateQueries({ queryKey: ["measurement-structure", activeMeasurementId] });
        queryClient.invalidateQueries({ queryKey: ["measurement-versions", activeMeasurementId] });
      }

      saveCurrentMeasurement();
      toast.success(t("measurements.builder.saveSuccess"));
    } catch {
      toast.error(t("measurements.builder.saveError"));
    }
  }

  async function handleSaveLocked(measurementId: string, clinicId: string) {
    const store = useMeasurementBuilderStore.getState();
    const { localNewVersion, draftsByVersion, selectedComponentId, panelVersionKey } = store;
    const draftOverrides = draftsByVersion[panelVersionKey] ?? {};

    const targetVersionKey = localNewVersion?.key ?? panelVersionKey;
    if (targetVersionKey === "v1") {
      toast.error(t("measurements.builder.versions.saveVersionError"));
      return;
    }

    try {
      const fresh = await fetchMeasurementStructure(clinicId, measurementId);
      let override: VersionElementOverride | null = null;

      if (localNewVersion) {
        let v1Result: { element: IServerElement; screenNumber: number } | undefined;
        if (localNewVersion.v1ServerId) {
          v1Result = findV1ById(fresh, localNewVersion.v1ServerId);
        } else if (localNewVersion.screenNumber && localNewVersion.rowNumber) {
          v1Result = findV1ByPosition(
            fresh,
            localNewVersion.screenNumber,
            localNewVersion.rowNumber,
            localNewVersion.orderInRow ?? 1,
          );
        }
        if (v1Result) {
          const merged = { ...localNewVersion.sourceValues, ...draftOverrides };
          const cp = buildCreatePayload(merged, localNewVersion.key, v1Result.element);
          override = {
            screenNumber: v1Result.screenNumber,
            rowNumber: cp.row_number,
            orderInRow: cp.order_in_row,
            element: cp,
          };
        }
      } else if (selectedComponentId && Object.keys(draftOverrides).length > 0) {
        for (const screen of fresh.screens) {
          for (const row of screen.rows) {
            const v1El = row.elements.find(
              (e) => e.id === selectedComponentId && (e.version_key ?? "v1") === "v1",
            );
            if (v1El) {
              const variantEl = findVariantElement(fresh, v1El, panelVersionKey, screen.screen_number);
              if (variantEl) {
                const patch = buildPatchPayload(draftOverrides, variantEl);
                override = {
                  screenNumber: screen.screen_number,
                  rowNumber: v1El.row_number,
                  orderInRow: v1El.order_in_row,
                  element: {
                    label: patch.label ?? variantEl.label,
                    element_type: v1El.element_type,
                    is_required: v1El.is_required,
                    row_number: v1El.row_number,
                    order_in_row: v1El.order_in_row,
                    config: patch.config ?? variantEl.config,
                    correct_answer_type: patch.correct_answer_type ?? variantEl.correct_answer_type,
                    correct_answers: patch.correct_answers,
                    allow_partial_score: patch.allow_partial_score,
                  },
                };
              }
              break;
            }
          }
          if (override) break;
        }
      }

      const payload = buildVersionStructurePayload(fresh, targetVersionKey, override);
      await saveStructure({ measurementId, payload });

      if (localNewVersion) {
        store.setLocalNewVersion(null);
        store.clearDraftForVersion(localNewVersion.key);
      } else {
        store.clearDraftForVersion(panelVersionKey);
      }

      queryClient.invalidateQueries({ queryKey: ["measurement-structure", measurementId] });
      queryClient.invalidateQueries({ queryKey: ["measurement-versions", measurementId] });
      toast.success(t("measurements.builder.versions.saveVersionSuccess"));
    } catch {
      toast.error(t("measurements.builder.versions.saveVersionError"));
    }
  }

  function handleBack() {
    navigate("/modules/measurements");
  }

  function handleClearCanvas() {
    clearCanvas();
  }

  function handleTogglePreview() {
    setPreviewMode(!isPreviewMode);
  }

  return {
    activeMeasurement,
    isPreviewMode,
    isDirty,
    isSaving,
    isLoadingStructure,
    hasSubmissions,
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  };
}
