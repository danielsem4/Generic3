import {
  useQuestionnaireBuilderStore,
  selectActiveScreenComponents,
} from "@/store/useQuestionnaireBuilderStore";
import type { DeviceSize } from "@/common/types/questionnaire";

const DEVICE_WIDTHS: Record<DeviceSize, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
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

  return {
    isPreviewMode,
    previewDevice,
    deviceWidth,
    components,
    screens,
    togglePreview,
    setDevice,
  };
}
