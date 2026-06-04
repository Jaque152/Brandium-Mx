"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { es } from "@/dictionaries/es";
import { en } from "@/dictionaries/en";

type Language = "es" | "en";
type Dictionary = typeof es;

interface I18nContextType {
  lang: Language;
  t: Dictionary;
  toggleLanguage: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("es");
  
  const toggleLanguage = () => setLang(lang === "es" ? "en" : "es");
  const t = lang === "es" ? es : en;

  return (
    <I18nContext.Provider value={{ lang, t, toggleLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
};