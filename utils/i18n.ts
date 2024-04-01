import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/enTranslations.json';
import esTranslation from './locales/esTranslations.json';
import frTranslation from './locales/frTranslations.json';
import koTranslation from './locales/koTranslations.json';
import ruTranslation from './locales/ruTranslations.json';
import filTranslation from './locales/filTranslations.json';
import viTranslation from './locales/viTranslations.json';
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
  ko: {
    translation: koTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
  fil: {
    translation: filTranslation,
  },
  vi: {
    translation: viTranslation,
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
