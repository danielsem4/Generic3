import { cn } from "@/lib/utils";
import { Mail, Phone } from "lucide-react";
import type { IUser } from "@/common/Users";

interface Props {
  manager: IUser;
  selected: boolean;
  onSelect: () => void;
}

export function ClinicManagerSelectCard({ manager, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-start rounded-xl border p-4 transition-all duration-150",
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:border-primary/50 hover:bg-muted/50",
      )}
    >
      <p className="font-semibold text-foreground">
        {manager.first_name} {manager.last_name}
      </p>
      <div className="mt-1.5 space-y-0.5 text-sm text-muted-foreground">
        <p className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 shrink-0" />
          {manager.email}
        </p>
        <p className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          {manager.phone_number ?? "—"}
        </p>
      </div>
    </button>
  );
}
