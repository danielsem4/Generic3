import { cn } from "@/lib/utils";

interface AnalyticsSummaryCardProps {
  label: string;
  value: string | number;
  highlighted?: boolean;
}

export function AnalyticsSummaryCard({
  label,
  value,
  highlighted = false,
}: Readonly<AnalyticsSummaryCardProps>) {
  return (
    <div
      className={cn(
        "bg-card p-6 rounded-2xl border border-border shadow-sm",
        highlighted && "border-l-4 border-l-primary"
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <h3
        className={cn(
          "mt-2 text-foreground",
          highlighted ? "text-xl font-bold truncate" : "text-3xl font-black"
        )}
      >
        {value}
      </h3>
    </div>
  );
}
