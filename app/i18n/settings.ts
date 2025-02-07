// i18n/settings.js or any appropriate file
export const fallbackLng = 'en';
export const languages = [fallbackLng, 'zh', 'pt'];
export const defaultNS = 'translation';
export const cookieName = 'i18next';

// Mapping of language codes to their display names
export const languageNames: { [key: string]: string } = {
  en: 'English',
  zh: '中文',
  pt: 'Português',
};

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}