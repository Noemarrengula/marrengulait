import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type SettingsContextType = {
  locale: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
  setLocale: (loc: string) => void;
  setCurrency: (cur: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  isDarkMode: boolean;
  isSystemPreference: boolean;
  resetToSystem: () => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'marrengula-settings';

interface StoredSettings {
  locale: string;
  currency: string;
  theme: 'light' | 'dark' | 'system';
}

function getStoredSettings(): StoredSettings {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    locale: 'pt-MZ',
    currency: 'MZN',
    theme: 'system',
  };
}

function getSystemPreferences(): { locale: string; currency: string; prefersDark: boolean } {
  if (typeof window === 'undefined') {
    return { locale: 'pt-MZ', currency: 'MZN', prefersDark: false };
  }

  const lang = navigator.language.split('-')[0] || 'pt';
  const validLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    locale: validLang === 'pt' ? 'pt-MZ' : validLang === 'en' ? 'en-US' : 'es-MZ',
    currency: validLang === 'pt' ? 'MZN' : 'USD',
    prefersDark,
  };
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoredSettings>(() => {
    const stored = getStoredSettings();
    return {
      locale: stored.locale || 'pt-MZ',
      currency: stored.currency || 'MZN',
      theme: stored.theme || 'system',
    };
  });

  const [isSystemPreference, setIsSystemPreference] = useState(true);
  const [systemDarkMode, setSystemDarkMode] = useState(false);

  useEffect(() => {
    const prefs = getSystemPreferences();
    setSystemDarkMode(prefs.prefersDark);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setLocale = useCallback((loc: string) => {
    setSettings(prev => {
      const lang = loc.split('-')[0];
      let currency = prev.currency;
      
      if (lang === 'pt') currency = 'MZN';
      else if (lang === 'en') currency = 'USD';
      else if (lang === 'es') currency = 'USD';

      return { ...prev, locale: loc, currency };
    });
    setIsSystemPreference(false);
  }, []);

  const setCurrency = useCallback((cur: string) => {
    setSettings(prev => ({ ...prev, currency: cur }));
    setIsSystemPreference(false);
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
    setIsSystemPreference(false);
  }, []);

  const resetToSystem = useCallback(() => {
    const prefs = getSystemPreferences();
    setSettings({
      locale: prefs.locale,
      currency: prefs.currency,
      theme: 'system',
    });
    setIsSystemPreference(true);
  }, []);

  const isDarkMode = settings.theme === 'dark' || 
    (settings.theme === 'system' && systemDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <SettingsContext.Provider
      value={{
        locale: settings.locale,
        currency: settings.currency,
        theme: settings.theme,
        setLocale,
        setCurrency,
        setTheme,
        isDarkMode,
        isSystemPreference,
        resetToSystem,
      }}
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
