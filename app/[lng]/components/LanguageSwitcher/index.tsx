import { useTranslation } from '../../../i18n'
import { LanguageBase } from './LanguageBase'

export const LanguageSwitcher = async ({ lng, path }: { lng: string; path?: string }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t, i18n } = await useTranslation(lng, 'LanguageSwitcher')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  console.log(t) // Example use of t, you can replace it with your actual translation logic

  return <LanguageBase i18n={i18n} lng={lng} path={path} />
}