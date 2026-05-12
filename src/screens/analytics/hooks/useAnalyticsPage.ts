import { useTranslation } from "react-i18next";

export function useAnalyticsPage() {
  const { t } = useTranslation();

  const title = t("analytics.title");
  const description = t("analytics.description");

  return { title, description };
}
