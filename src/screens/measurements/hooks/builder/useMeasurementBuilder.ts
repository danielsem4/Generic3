import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";
import { useMeasurementsQuery } from "../queries/useMeasurementsQuery";
import { useMeasurementStructureQuery } from "../queries/useMeasurementStructureQuery";
import { useSaveMeasurementStructure } from "../queries/useSaveMeasurementStructure";
import {
  transformPayloadToScreens,
  transformScreensToPayload,
} from "../../lib/transformStructure";

export function useMeasurementBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const clinicId = useAuthStore((s) => s.clinicId);

  const { data: fetchedMeasurements } = useMeasurementsQuery(clinicId);
  const {
    data: structureData,
    isLoading: isLoadingStructureQuery,
  } = useMeasurementStructureQuery(id);

  const addMeasurement = useMeasurementBuilderStore((s) => s.addMeasurement);
  const loadMeasurement = useMeasurementBuilderStore(
    (s) => s.loadMeasurement,
  );
  const hydrateScreens = useMeasurementBuilderStore((s) => s.hydrateScreens);
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
  }, [id, structureData, hydrateScreens]);

  const isLoadingStructure = !!id && isLoadingStructureQuery;

  async function handleSave() {
    if (!activeMeasurementId) return;

    try {
      const payload = transformScreensToPayload(screens);
      await saveStructure({ measurementId: activeMeasurementId, payload });
      saveCurrentMeasurement();
      toast.success(t("measurements.builder.saveSuccess"));
      navigate("/modules/measurements");
    } catch {
      toast.error(t("measurements.builder.saveError"));
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
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  };
}
