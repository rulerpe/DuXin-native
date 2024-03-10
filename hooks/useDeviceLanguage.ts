import { useState, useEffect } from 'react';
import { getLocales } from 'expo-localization';

const useDeviceLanguage = (): string => {
  const [language, setLanguage] = useState('');

  useEffect(() => {
    const locales = getLocales();
    const languageCode = locales?.[0]?.languageCode ?? '';
    setLanguage(languageCode);
  }, []);
  return language;
};

export default useDeviceLanguage;
