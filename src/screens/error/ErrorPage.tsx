import { useRouteError, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const message =
    error instanceof Error ? error.message : t("error.fallback");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-4xl font-bold text-foreground">
        {t("error.title")}
      </h1>
      <p className="text-lg text-muted-foreground">{message}</p>
      <Button onClick={() => navigate("/home")} variant="outline">
        {t("error.back")}
      </Button>
    </div>
  );
}
