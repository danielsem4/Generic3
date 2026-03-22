import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { type Theme, useThemeStore } from "@/store/useThemeStore";
import { cn } from "@/lib/utils";

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
] as const;

const themes: Theme[] = ["light", "dark", "system"];

export default function Settings() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 border-b border-border pb-2">
              {t("settings.appearance")}
            </h2>
            <div className="flex gap-4">
              {themes.map((value) => (
                <ThemeCard
                  key={value}
                  value={value}
                  label={t(`settings.themes.${value}`)}
                  selected={theme === value}
                  onSelect={setTheme}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-4 border-b border-border pb-2">
              {t("settings.language")}
            </h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "he" | "ru" | "ar")}
              className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </section>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({ value, label, selected, onSelect }: {
  value: Theme;
  label: string;
  selected: boolean;
  onSelect: (theme: Theme) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={cn(
          "relative w-28 h-20 rounded-xl overflow-hidden border-2 transition-colors",
          selected ? "border-foreground" : "border-border hover:border-muted-foreground",
        )}
      >
        <ThemePreview value={value} />
        {selected && (
          <div className="absolute bottom-1.5 end-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground">
            <Check className="h-3 w-3 text-background" />
          </div>
        )}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function ThemePreview({ value }: { value: Theme }) {
  if (value === "light") {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
        <div className="rounded-lg bg-white px-3 py-2 shadow-sm border border-gray-200">
          <span className="text-lg font-semibold text-gray-800">Aa</span>
        </div>
      </div>
    );
  }

  if (value === "dark") {
    return (
      <div className="h-full w-full bg-gray-700 flex items-center justify-center">
        <div className="rounded-lg bg-gray-900 px-3 py-2 shadow-sm border border-gray-600">
          <span className="text-lg font-semibold text-gray-100">Aa</span>
        </div>
      </div>
    );
  }

  // System: split view
  return (
    <div className="h-full w-full flex">
      <div className="w-1/2 bg-gray-700 flex items-center justify-end pe-0.5">
        <div className="rounded-s-lg bg-gray-900 px-2 py-2 border border-gray-600 border-e-0">
          <span className="text-lg font-semibold text-gray-100">Aa</span>
        </div>
      </div>
      <div className="w-1/2 bg-gray-100 flex items-center justify-start ps-0.5">
        <div className="rounded-e-lg bg-white px-2 py-2 border border-gray-200 border-s-0">
          <span className="text-lg font-semibold text-gray-800">Aa</span>
        </div>
      </div>
    </div>
  );
}
