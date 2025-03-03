'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from '../../i18n/client'
import { LanguageSwitcher } from '../components/LanguageSwitcher/client'
import { useState } from 'react'

export default function Page({ params }: {
  params: Promise<{ lng: string; }>;
}) {
  const { lng } = React.use<{ lng: string }>(params)
  const { t } = useTranslation(lng, 'client-page')
  const [counter, setCounter] = useState(0)
  return (
    <>
      <main>
        <p>{t('counter', { count: counter })}</p>
        <div>
          <button onClick={() => setCounter(Math.max(0, counter - 1))}>-</button>
          <button onClick={() => setCounter(Math.min(10, counter + 1))}>+</button>
        </div>
        <Link href={`/${lng}/second-client-page`}>
          {t('to-second-client-page')}
        </Link>
        <Link href={`/${lng}`}>
          <button type="button">
            {t('back-to-home')}
          </button>
        </Link>
      </main>
      <LanguageSwitcher lng={lng} path="/client-page" />
    </>
  )
}