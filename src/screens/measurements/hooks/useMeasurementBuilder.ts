import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";
import { useSaveMeasurementStructure } from "./useSaveMeasurementStructure";
import { transformScreensToPayload } from "../lib/transformStructure";

export function useMeasurementBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loadMeasurement = useMeasurementBuilderStore(
    (s) => s.loadMeasurement,
  );
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
    if (id) {
      loadMeasurement(id);
    }
  }, [id, loadMeasurement]);

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
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  };
}
