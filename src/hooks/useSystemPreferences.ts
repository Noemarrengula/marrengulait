import { useState, useEffect, useCallback } from 'react';

interface SystemPreferences {
  prefersDarkMode: boolean;
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
  language: string;
  locale: string;
  currency: string;
  timezone: string;
}

const STORAGE_KEY = 'marrengula-system-preferences';

const languageToLocale: Record<string, string> = {
  pt: 'pt-MZ',
  en: 'en-US',
  es: 'es-MZ',
};

const languageToCurrency: Record<string, string> = {
  pt: 'MZN',
  en: 'USD',
  es: 'USD',
};

export function useSystemPreferences() {
  const [preferences, setPreferences] = useState<SystemPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return getDefaultPreferences();
  });

  const [isSystem, setIsSystem] = useState<Record<string, boolean>>({
    theme: true,
    locale: true,
    currency: true,
  });

  function getDefaultPreferences(): SystemPreferences {
    if (typeof window === 'undefined') {
      return {
        prefersDarkMode: false,
        prefersColorScheme: 'light',
        language: 'pt',
        locale: 'pt-MZ',
        currency: 'MZN',
        timezone: 'Africa/Maputo',
      };
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const lang = navigator.language.split('-')[0] || 'pt';
    const validLang = ['pt', 'en', 'es'].includes(lang) ? lang : 'pt';

    return {
      prefersDarkMode: prefersDark,
      prefersColorScheme: prefersDark ? 'dark' : 'light',
      language: validLang,
      locale: languageToLocale[validLang] || 'pt-MZ',
      currency: languageToCurrency[validLang] || 'MZN',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Maputo',
    };
  }

  const updatePreference = useCallback(<K extends keyof SystemPreferences>(
    key: K,
    value: SystemPreferences[K],
    isSystemValue: boolean = false
  ) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    setIsSystem((prev) => ({ ...prev, [key]: isSystemValue }));
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (isSystem.theme) {
        setPreferences((prev) => ({
          ...prev,
          prefersDarkMode: e.matches,
          prefersColorScheme: e.matches ? 'dark' : 'light',
        }));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isSystem.theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', preferences.prefersDarkMode);
    document.documentElement.lang = preferences.language;
  }, [preferences.prefersDarkMode, preferences.language]);

  return {
    preferences,
    isSystem,
    setPreference: updatePreference,
    resetToSystem: () => {
      const defaults = getDefaultPreferences();
      setPreferences(defaults);
      setIsSystem({ theme: true, locale: true, currency: true });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    },
  };
}

export type { SystemPreferences };
