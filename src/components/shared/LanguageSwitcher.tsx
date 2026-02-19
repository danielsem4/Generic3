import { useTranslation } from "react-i18next";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language as LanguageCode;

  const handleChange = (code: LanguageCode) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className="flex gap-1 flex-wrap justify-center">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChange(code)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
            current === code
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
