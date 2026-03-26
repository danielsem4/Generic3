import { Link } from "react-router-dom";
import { useModules } from "./hooks/useModules";
import { ModuleCard } from "./components/ModuleCard";
import { AdminModulesView } from "./components/AdminModulesView";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function Modules() {
  const { t } = useTranslation();
  const role = useAuthStore((s) => s.role);

  if (role === "ADMIN") return <AdminModulesView />;
  const { items, isLoading, error } = useModules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-destructive">{t("home.error")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{t("modules.title")}</h1>
          <div className="mt-2 h-1 w-10 rounded-full bg-primary" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            className="block w-full rounded-2xl"
          >
            <ModuleCard
              item={item}
              title={t(`modules.cards.${item.key}.title`)}
              description={t(`modules.cards.${item.key}.description`)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
