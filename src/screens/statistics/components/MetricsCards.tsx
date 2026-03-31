import { Stethoscope, Users, FlaskConical, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { StatCard } from "@/screens/home/components/StatCard";

interface IMetricsCardsProps {
  totalDoctors: number;
  totalPatients: number;
  researchPatients: number;
  nonResearchPatients: number;
}

export function MetricsCards({
  totalDoctors,
  totalPatients,
  researchPatients,
  nonResearchPatients,
}: IMetricsCardsProps) {
  const { t } = useTranslation();

  const cards = [
    { icon: Stethoscope, label: t("statistics.totalDoctors"), value: totalDoctors },
    { icon: Users, label: t("statistics.totalPatients"), value: totalPatients },
    { icon: FlaskConical, label: t("statistics.researchPatients"), value: researchPatients },
    { icon: UserCheck, label: t("statistics.nonResearchPatients"), value: nonResearchPatients },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
        />
      ))}
    </div>
  );
}
