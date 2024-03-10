import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import enTranslation from './locales/enTranslations.json';
import esTranslation from './locales/esTranslations.json';
import frTranslation from './locales/frTranslations.json';
import zhTranslation from './locales/zhTranslations.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
};

const locales = getLocales();
const languageCode = locales?.[0]?.languageCode ?? '';
i18n.use(initReactI18next).init({
  lng: languageCode,
  compatibilityJSON: 'v3',
  resources,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
