import {
  useEvaluationBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useEvaluationBuilderStore";
import type { DeviceSize } from "@/common/types/evaluation";

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
  const isPreviewMode = useEvaluationBuilderStore((s) => s.isPreviewMode);
  const previewDevice = useEvaluationBuilderStore((s) => s.previewDevice);
  const setPreviewMode = useEvaluationBuilderStore((s) => s.setPreviewMode);
  const setPreviewDevice = useEvaluationBuilderStore(
    (s) => s.setPreviewDevice,
  );
  const components = useEvaluationBuilderStore(selectActiveScreenComponents);
  const screens = useEvaluationBuilderStore((s) => s.screens);

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
