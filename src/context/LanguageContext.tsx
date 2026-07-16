'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ko: string, en: string) => string;
  d: (localizedObj: { ko: string; en: string } | undefined | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ko');

  useEffect(() => {
    const savedLang = window.localStorage.getItem('cncc-lang');
    if (savedLang === 'ko' || savedLang === 'en') {
      const timeoutId = window.setTimeout(() => setLanguageState(savedLang), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('cncc-lang', lang);
    }
  };

  // Translate static text helper
  const t = (ko: string, en: string): string => {
    return language === 'ko' ? ko : en;
  };

  // Translate dynamic DB object helper
  const d = (localizedObj: { ko: string; en: string } | undefined | null): string => {
    if (!localizedObj) return '';
    return language === 'ko' ? localizedObj.ko : localizedObj.en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, d }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
