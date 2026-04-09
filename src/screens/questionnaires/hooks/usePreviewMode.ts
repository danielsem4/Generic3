import {
  useQuestionnaireBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useQuestionnaireBuilderStore";
import type { DeviceSize } from "@/common/types/questionnaire";

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
  const isPreviewMode = useQuestionnaireBuilderStore((s) => s.isPreviewMode);
  const previewDevice = useQuestionnaireBuilderStore((s) => s.previewDevice);
  const setPreviewMode = useQuestionnaireBuilderStore((s) => s.setPreviewMode);
  const setPreviewDevice = useQuestionnaireBuilderStore(
    (s) => s.setPreviewDevice,
  );
  const components = useQuestionnaireBuilderStore(selectActiveScreenComponents);
  const screens = useQuestionnaireBuilderStore((s) => s.screens);

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
