import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SiteHeaderProps {
  onToggleSidebar: () => void;
}

export const SiteHeader = ({ onToggleSidebar }: SiteHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header className="w-full h-12 flex items-center justify-between px-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 hover:bg-muted transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold">{t("header.title")}</h1>
      </div>

    </header>
  );
};
