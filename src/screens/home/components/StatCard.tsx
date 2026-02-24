import type { LucideIcon } from "lucide-react";

interface IStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
}

export function StatCard({ icon: Icon, label, value }: IStatCardProps) {
  return (
    <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-sm hover:bg-primary/90 transition-all flex items-center gap-3">
      <Icon size={24} />
      <p className="text-sm font-medium opacity-80">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
