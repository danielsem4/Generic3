import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { IQScreen, DeviceSize } from "@/common/types/measurement";
import { DeviceFrameSelector } from "./DeviceFrameSelector";
import { DeviceFrame } from "./DeviceFrame";
import { CanvasComponentRenderer } from "./CanvasComponentRenderer";

interface PreviewOverlayProps {
  screens: IQScreen[];
  device: DeviceSize;
  deviceWidth: number;
  deviceHeight?: number;
  onDeviceChange: (device: DeviceSize) => void;
  onExit: () => void;
}

const noop = () => {};

export function PreviewOverlay({
  screens,
  device,
  deviceWidth,
  deviceHeight,
  onDeviceChange,
  onExit,
}: PreviewOverlayProps) {
  const { t } = useTranslation();
  const [previewScreenIndex, setPreviewScreenIndex] = useState(0);

  const activeScreen = screens[previewScreenIndex];
  const components = activeScreen?.components ?? [];
  const canGoPrev = previewScreenIndex > 0;
  const canGoNext = previewScreenIndex < screens.length - 1;

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">
            {t("measurements.builder.previewMode")}
          </h1>
          {screens.length > 1 && (
            <span className="text-sm text-muted-foreground">
              {t("measurements.builder.preview.screenOf", {
                current: previewScreenIndex + 1,
                total: screens.length,
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <DeviceFrameSelector activeDevice={device} onChange={onDeviceChange} />
          <Button variant="outline" size="sm" onClick={onExit} className="gap-1">
            <X size={14} />
            {t("measurements.builder.exitPreview")}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex items-start justify-center p-8 bg-muted/30">
        <DeviceFrame width={deviceWidth} height={deviceHeight}>
          <div className="space-y-2 p-4">
            {components.map((component) => (
              <CanvasComponentRenderer
                key={component.id}
                component={component}
                isSelected={false}
                isPreview
                onSelect={noop}
                onRemove={noop}
              />
            ))}
          </div>

          {screens.length > 1 && (
            <div className="flex items-center justify-between border-t px-4 py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewScreenIndex((i) => i - 1)}
                disabled={!canGoPrev}
                className="gap-1"
              >
                <ChevronLeft size={14} />
                {t("measurements.builder.preview.previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewScreenIndex((i) => i + 1)}
                disabled={!canGoNext}
                className="gap-1"
              >
                {t("measurements.builder.preview.next")}
                <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </DeviceFrame>
      </div>
    </div>
  );
}
