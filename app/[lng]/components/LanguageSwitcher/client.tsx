'use client'

import { LanguageBase } from './LanguageBase'
import { useTranslation } from '../../../i18n/client'
// import { useParams } from 'next/navigation'

export function LanguageSwitcher({ lng, path }: {
  lng: string;
  path: string;
}) {
  const { i18n } = useTranslation(lng, 'LanguageSwitcher')
  return <LanguageBase i18n={i18n} lng={lng} path={path} />
}

// if you like to avoid prop drilling, you can do so with useParams()
// export function LanguageSwitcher({ path }: {
//   path: string;
// }) {
//   const params = useParams<{ lng: string; }>()
//   const { i18n } = useTranslation(params.lng, 'LanguageSwitcher')
//   return <LanguageBase i18n={i18n} lng={params.lng} path={path} />
// }