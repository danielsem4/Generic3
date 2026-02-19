import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en";
import he from "@/locales/he";
import ru from "@/locales/ru";
import ar from "@/locales/ar";

export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "he", label: "עברית", dir: "rtl" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

const applyDirection = (lng: string) => {
  const lang = LANGUAGES.find((l) => l.code === lng);
  const dir = lang?.dir ?? "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
};

const LANGUAGE_STORAGE_KEY = "app_language";

const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
    ru: { translation: ru },
    ar: { translation: ar },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  applyDirection(lng);
});
applyDirection(i18n.language);

export default i18n;
