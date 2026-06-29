import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Share2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";

export default function FileShare() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleViewPatients() {
    navigate("/patients");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <BackButton />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary shadow-sm">
            <Share2 size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            {t("fileShare.title")}
          </h1>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-8 flex flex-col items-start gap-6">
          <p className="text-muted-foreground text-base font-medium leading-relaxed">
            {t("fileShare.description")}
          </p>

          <Button
            onClick={handleViewPatients}
            className="rounded-full gap-2 px-6 font-bold shadow-lg transition-all hover:opacity-90"
          >
            <Users size={18} strokeWidth={3} />
            {t("fileShare.viewPatients")}
          </Button>
        </div>
      </div>
    </div>
  );
}
