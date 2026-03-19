import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "@/i18n";

type Language = "en" | "he" | "ru" | "ar";

const rtlLanguages: Language[] = ["he", "ar"];

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: (localStorage.getItem("app-language") as Language) ?? "en",
      setLanguage: (lang: Language) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("app-language", lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = rtlLanguages.includes(lang)
          ? "rtl"
          : "ltr";
        set({ language: lang });
      },
    }),
    {
      name: "app-language-store",
      version: 1,
    },
  ),
);
