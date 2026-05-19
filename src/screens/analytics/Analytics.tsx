import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAnalyticsModules } from "./hooks/useAnalyticsPage";
import { AnalyticsCard } from "./components/AnalyticsCard";

export default function Analytics() {
  const { t } = useTranslation();
  const { items } = useAnalyticsModules();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {t("analytics.title")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
             {t("analytics.subtitle")}
          </p>
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
            <AnalyticsCard
              item={item}
              title={t(`analytics.cards.${item.key}.title`)}
              description={t(`analytics.cards.${item.key}.description`)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}