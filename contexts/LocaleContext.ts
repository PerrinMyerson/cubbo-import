import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocaleContextType {
  language: string;
  toggleLanguage: () => void;
  currency: string;
  toggleCurrency: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [currency, setCurrency] = useState<string>('USD');

  const toggleLanguage = () => setLanguage(lang => lang === 'en' ? 'es' : 'en');
  const toggleCurrency = () => setCurrency(cur => cur === 'USD' ? 'MXN' : 'USD');

  return (
    <LocaleContext.Provider value={{ language, toggleLanguage, currency, toggleCurrency }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
