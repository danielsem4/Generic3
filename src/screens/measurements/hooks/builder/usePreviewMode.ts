import {
  useMeasurementBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useMeasurementBuilderStore";
import type { DeviceSize } from "@/common/types/measurement";

const DEVICE_WIDTHS: Record<DeviceSize, number> = {
  mobile: 393,
  tablet: 744,
  desktop: 1024,
};

const DEVICE_HEIGHTS: Record<DeviceSize, number | undefined> = {
  mobile: 852,
  tablet: 1133,
  desktop: undefined,
};

export function usePreviewMode() {
  const isPreviewMode = useMeasurementBuilderStore((s) => s.isPreviewMode);
  const previewDevice = useMeasurementBuilderStore((s) => s.previewDevice);
  const setPreviewMode = useMeasurementBuilderStore((s) => s.setPreviewMode);
  const setPreviewDevice = useMeasurementBuilderStore(
    (s) => s.setPreviewDevice,
  );
  const components = useMeasurementBuilderStore(selectActiveScreenComponents);
  const screens = useMeasurementBuilderStore((s) => s.screens);

  function togglePreview() {
    setPreviewMode(!isPreviewMode);
  }

  function setDevice(device: DeviceSize) {
    setPreviewDevice(device);
  }

  const deviceWidth = DEVICE_WIDTHS[previewDevice];
  const deviceHeight = DEVICE_HEIGHTS[previewDevice];

  return {
    isPreviewMode,
    previewDevice,
    deviceWidth,
    deviceHeight,
    components,
    screens,
    togglePreview,
    setDevice,
  };
}
