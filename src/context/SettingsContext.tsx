import React, { createContext, useContext, useEffect, useState } from "react";

export type SettingsContextType = {
  locale: string;
  currency: string;
  setLocale: (loc: string) => void;
  setCurrency: (cur: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>(
    () => localStorage.getItem("locale") || "pt-MZ"
  );
  const [currency, setCurrency] = useState<string>(
    () => localStorage.getItem("currency") || "MT"
  );

  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <SettingsContext.Provider
      value={{ locale, currency, setLocale, setCurrency }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return ctx;
}
