import { useTranslation } from "react-i18next";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DeviceSize } from "@/common/types/measurement";

interface DeviceFrameSelectorProps {
  activeDevice: DeviceSize;
  onChange: (device: DeviceSize) => void;
}

const devices: { key: DeviceSize; icon: React.ElementType; labelKey: string }[] = [
  { key: "mobile", icon: Smartphone, labelKey: "measurements.device.mobile" },
  { key: "tablet", icon: Tablet, labelKey: "measurements.device.tablet" },
  { key: "desktop", icon: Monitor, labelKey: "measurements.device.desktop" },
];

export function DeviceFrameSelector({
  activeDevice,
  onChange,
}: DeviceFrameSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-lg border bg-muted/50 p-1">
      {devices.map(({ key, icon: Icon, labelKey }) => (
        <Button
          key={key}
          variant={activeDevice === key ? "default" : "ghost"}
          size="sm"
          onClick={() => onChange(key)}
          className="gap-1.5 h-7 px-3 text-xs"
        >
          <Icon size={14} />
          {t(labelKey)}
        </Button>
      ))}
    </div>
  );
}
