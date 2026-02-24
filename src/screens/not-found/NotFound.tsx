import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <h1 className="text-6xl font-bold text-foreground">{t("notFound.title")}</h1>
      <p className="text-lg text-muted-foreground">{t("notFound.subtitle")}</p>
      <Button onClick={() => navigate("/home")} variant="outline">
        {t("notFound.back")}
      </Button>
    </div>
  );
}
