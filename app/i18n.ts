import i18n from 'i18next';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

if (!i18n.isInitialized) { // Prevent re-initialization
  i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
      fallbackLng: 'en',
      backend: {
        loadPath: '/locales/{{lng}}/main.json',
      },
      react: { useSuspense: false }, // Disable Suspense to prevent SSR issues
    });
}

export default i18n;
