import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import en from "../locales/en";
import hi from "../locales/hi";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

const getInitialLanguage = (): Language => {
  const savedLanguage = localStorage.getItem("anmol-language");

  if (savedLanguage === "en") {
    return "en";
  }

  return "hi";
};

export const LanguageProvider = ({
  children,
}: LanguageProviderProps) => {
  const [language, setLanguage] =
    useState<Language>(getInitialLanguage);

  const toggleLanguage = () => {
    setLanguage((currentLanguage) => {
      const nextLanguage =
        currentLanguage === "hi" ? "en" : "hi";

      return nextLanguage;
    });
  };

  useEffect(() => {
    localStorage.setItem("anmol-language", language);

    document.documentElement.lang = language;
  }, [language]);

  const translations = language === "hi" ? hi : en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
};