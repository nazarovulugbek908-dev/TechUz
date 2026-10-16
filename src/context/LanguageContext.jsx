import React, { createContext, useState, useEffect } from 'react';
import { getTranslation } from '../i18n';
import { storage } from '../utils/storage';

export const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = 'techuz_language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return storage.get(LANGUAGE_STORAGE_KEY, 'uz');
  });

  useEffect(() => {
    storage.set(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'uz' ? 'ru' : 'uz'));
  };

  const setLang = (lang) => {
    if (lang === 'uz' || lang === 'ru') {
      setLanguage(lang);
    }
  };

  const t = (key) => {
    return getTranslation(key, language);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: setLang,
        toggleLanguage,
        t,
        isUz: language === 'uz',
        isRu: language === 'ru'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
