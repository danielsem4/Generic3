import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import he from "./locales/he";
import ru from "./locales/ru";
import ar from "./locales/ar";

const storedLang = localStorage.getItem("app-language") ?? "en";
const rtlLanguages = ["he", "ar"];

document.documentElement.lang = storedLang;
document.documentElement.dir = rtlLanguages.includes(storedLang)
  ? "rtl"
  : "ltr";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
    ru: { translation: ru },
    ar: { translation: ar },
  },
  lng: storedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
