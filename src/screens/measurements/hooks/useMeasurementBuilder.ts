import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMeasurementBuilderStore } from "@/store/useMeasurementBuilderStore";

export function useMeasurementBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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
  const isDirty = useMeasurementBuilderStore((s) => s.isDirty);

  const activeMeasurement = measurements.find(
    (q) => q.id === activeMeasurementId,
  );

  useEffect(() => {
    if (id) {
      loadMeasurement(id);
    }
  }, [id, loadMeasurement]);

  function handleSave() {
    saveCurrentMeasurement();
    navigate("/modules/measurements");
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
    handleSave,
    handleBack,
    handleClearCanvas,
    handleTogglePreview,
  };
}
