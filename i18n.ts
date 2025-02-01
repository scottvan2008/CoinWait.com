// i18n.js (or i18n.ts)
import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/main.json',
    },
  });

export default i18n;
