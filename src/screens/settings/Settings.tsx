import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguageStore } from "@/store/useLanguageStore";

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
] as const;

export default function Settings() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguageStore();

  return (
      <div className="p-8">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

            <Card>
              <CardHeader>
                <CardTitle>{t("settings.language")}</CardTitle>
                <CardDescription>{t("settings.languageDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
  );
}
