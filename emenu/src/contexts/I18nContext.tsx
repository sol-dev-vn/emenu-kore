'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { t, TranslationKeys } from '@/lib/i18n';

type Locale = 'en' | 'vi';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKeys, params?: Record<string, string | number>) => string;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  // Load saved locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('emenu-locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'vi')) {
      setLocaleState(savedLocale);
    } else {
      // Detect browser locale
      const browserLocale = navigator.language.split('-')[0] as Locale;
      if (browserLocale === 'en' || browserLocale === 'vi') {
        setLocaleState(browserLocale);
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('emenu-locale', newLocale);
    document.documentElement.lang = newLocale;
  };

  const toggleLocale = () => {
    setLocale(locale === 'en' ? 'vi' : 'en');
  };

  const translateFunction = (key: TranslationKeys, params?: Record<string, string | number>) => {
    return t(key, params, locale);
  };

  return (
    <I18nContext.Provider value={{
      locale,
      setLocale,
      t: translateFunction,
      toggleLocale
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export default I18nProvider;