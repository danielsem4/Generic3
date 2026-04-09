interface DeviceFrameProps {
  width: number;
  height?: number;
  children: React.ReactNode;
}

export function DeviceFrame({ width, height, children }: DeviceFrameProps) {
  return (
    <div
      className="rounded-2xl border-2 border-border bg-card shadow-xl overflow-y-auto"
      style={{
        width: `${width}px`,
        height: height ? `${height}px` : undefined,
        maxHeight: "calc(100vh - 140px)",
      }}
    >
      <div className="h-6 border-b bg-muted/50 flex items-center justify-center">
        <div className="h-1.5 w-16 rounded-full bg-muted-foreground/20" />
      </div>
      {children}
    </div>
  );
}
