import {
  Users,
  Database,
  Pill,
  FileText,
  Building2,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHome } from "./hooks/useHome";
import { StatCard } from "./components/StatCard";
import { UsersTable } from "./components/UsersTable";
import type { UserRole } from "@/common/types/Role";
import type { LucideIcon } from "lucide-react";
import type { IUser, IUserModule } from "@/common/Users";

interface StatCardConfig {
  icon: LucideIcon;
  labelKey: string;
  getValue: (users: IUser[], modules: IUserModule[]) => number;
}

type RoleDashboardConfig = {
  cards: StatCardConfig[];
  tableTitle: string;
};

function useDashboardConfig(
  role: UserRole,
  t: (key: string) => string,
): RoleDashboardConfig {
  const configs: Record<UserRole, RoleDashboardConfig> = {
    admin: {
      cards: [
        { icon: Pill, labelKey: "home.medications", getValue: () => 0 },
        { icon: Users, labelKey: "home.clinicManagers", getValue: () => 0 },
        {
          icon: Database,
          labelKey: "home.modules",
          getValue: (_, m) => m.length,
        },
        { icon: Building2, labelKey: "home.clinics", getValue: () => 0 },
      ],
      tableTitle: t("home.clinicManagers"),
    },
    clinic_manager: {
      cards: [
        { icon: Stethoscope, labelKey: "home.doctors", getValue: () => 0 },
        { icon: Users, labelKey: "home.patients", getValue: (u) => u.length },
        {
          icon: Database,
          labelKey: "home.modules",
          getValue: (_, m) => m.length,
        },
        { icon: Pill, labelKey: "home.medications", getValue: () => 0 },
      ],
      tableTitle: t("home.doctors"),
    },
    doctor: {
      cards: [
        { icon: Users, labelKey: "home.patients", getValue: (u) => u.length },
        { icon: Pill, labelKey: "home.medications", getValue: () => 0 },
        {
          icon: Database,
          labelKey: "home.modules",
          getValue: (_, m) => m.length,
        },
        {
          icon: ClipboardList,
          labelKey: "home.evaluations",
          getValue: () => 0,
        },
      ],
      tableTitle: t("home.patients"),
    },
    patient: {
      cards: [
        {
          icon: Database,
          labelKey: "home.modules",
          getValue: (_, m) => m.length,
        },
        { icon: Pill, labelKey: "home.medications", getValue: () => 0 },
      ],
      tableTitle: "",
    },
    unknown: {
      cards: [
        {
          icon: FileText,
          labelKey: "home.modules",
          getValue: (_, m) => m.length,
        },
      ],
      tableTitle: "",
    },
  };
  return configs[role];
}

export default function Home() {
  const { t } = useTranslation();
  const { role, users, modules, isLoading, error } = useHome();
  const { cards, tableTitle } = useDashboardConfig(role, t);

  if (isLoading) return <div>{t("home.loading")}</div>;
  if (error) return <div>{t("home.error")}</div>;

  return (
    <div className="p-8">
      <div className="w-full flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <StatCard
              key={card.labelKey}
              icon={card.icon}
              label={t(card.labelKey)}
              value={card.getValue(users, modules)}
            />
          ))}
        </div>
      </div>
      {role !== "patient" && <UsersTable users={users} title={tableTitle} />}
    </div>
  );
}
