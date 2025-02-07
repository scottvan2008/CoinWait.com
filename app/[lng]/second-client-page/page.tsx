'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from '../../i18n/client'
import { LanguageSwitcher } from '../components/LanguageSwitcher/client'

export default function Page({ params }: {
  params: Promise<{ lng: string; }>;
}) {
  const { lng } = React.use<{ lng: string }>(params)
  const { t } = useTranslation(lng, 'second-client-page')
  return (
    <>
      <main>
        <Link href={`/${lng}`}>
          <button type="button">
            {t('back-to-home')}
          </button>
        </Link>
      </main>
      <LanguageSwitcher lng={lng} path="/second-client-page" />
    </>
  )
}