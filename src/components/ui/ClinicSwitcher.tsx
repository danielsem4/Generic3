import { useState, useRef, useEffect } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useClinicSwitcher } from "@/hooks/common/useClinicSwitcher";
import type { IClinic } from "@/common/types/User";

export function ClinicSwitcher() {
  const clinicName = useAuthStore((s) => s.clinicName);
  const clinicImage = useAuthStore((s) => s.clinicImage);
  const clinicId = useAuthStore((s) => s.clinicId);
  const { clinics, isSwitching, switchClinic } = useClinicSwitcher();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative px-2">
      <button
        type="button"
        onClick={() => clinics.length > 1 && setOpen((o) => !o)}
        disabled={isSwitching}
        className={`flex items-center gap-3 w-full rounded-lg py-2.5 transition-colors ${
          clinics.length > 1
            ? "hover:bg-primary/10 cursor-pointer"
            : "cursor-default"
        }`}
      >
        <ClinicAvatar name={clinicName} image={clinicImage} />
        <div className="flex-1 text-start min-w-0">
          <p className="text-xs text-muted-foreground leading-none mb-0.5">
            Current clinic
          </p>
          <p className="text-sm font-semibold truncate">{clinicName}</p>
        </div>
        {clinics.length > 1 && (
          <ChevronsUpDown
            size={15}
            className="shrink-0 text-muted-foreground"
          />
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-lg border border-border bg-background shadow-lg overflow-hidden">
          <p className="px-3 pt-2.5 pb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Switch clinic
          </p>
          {clinics.map((clinic) => (
            <ClinicRow
              key={clinic.id}
              clinic={clinic}
              isActive={clinic.id === clinicId}
              disabled={isSwitching}
              onSelect={() => {
                switchClinic(clinic.id);
                setOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ClinicRow({
  clinic,
  isActive,
  disabled,
  onSelect,
}: {
  clinic: IClinic;
  isActive: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || isActive}
      onClick={onSelect}
      className={`flex items-center gap-3 w-full px-3 py-2.5 text-sm transition-colors ${
        isActive
          ? "bg-primary/10 cursor-default"
          : "hover:bg-muted cursor-pointer"
      }`}
    >
      <ClinicAvatar name={clinic.clinic_name} image={clinic.clinic_image_url} />
      <span className="flex-1 text-start truncate font-medium">
        {clinic.clinic_name}
      </span>
      {isActive && <Check size={15} className="shrink-0 text-primary" />}
    </button>
  );
}

function ClinicAvatar({ name, image }: { name: string; image: string | null }) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-8 h-8 rounded-lg object-cover shrink-0"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-semibold text-sm shrink-0 text-primary">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
