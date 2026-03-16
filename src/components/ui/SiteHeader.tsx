import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePageTitle } from "@/hooks/common/usePageTitle";

interface SiteHeaderProps {
  onToggleSidebar: () => void;
}

export const SiteHeader = ({ onToggleSidebar }: SiteHeaderProps) => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle();

  return (
    <header className="w-full h-12 flex items-center px-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="rounded-md p-2 hover:bg-muted transition"
          aria-label={t("common.toggleSidebar")}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold">{pageTitle}</h1>
      </div>
    </header>
  );
};
