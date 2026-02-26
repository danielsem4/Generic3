import React from "react";
import { Users, Database, Pill, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHome } from "./hooks/useHome";
import { StatCard } from "./components/StatCard";
import { UsersTable } from "./components/UsersTable";

export default function Home() {
  const { t } = useTranslation();
  const { users, modules, isLoading, error } =
    useHome();

  if (isLoading) return <div>{t("home.loading")}</div>;
  if (error) return <div>{t("home.error")}</div>;

  return (
        <div className="p-8">
          <div className="w-full flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label={t("home.patients")}
                value={users.length}
              />
              <StatCard icon={Database} label={t("home.clinics")} value={1} />
              <StatCard
                icon={FileText}
                label={t("home.modules")}
                value={modules.length}
              />
              <StatCard icon={Pill} label={t("home.medications")} value={0} />
            </div>
          </div>
          <UsersTable users={users} />
        </div>
  );
}
