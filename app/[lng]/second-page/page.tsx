import Link from 'next/link'
import { useTranslation } from '../../i18n'
import { LanguageSwitcher } from '../components/LanguageSwitcher'

export default async function Page({ params }: {
  params: Promise<{ lng: string; }>;
}) {
  const { lng } = await params
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, 'second-page')
  return (
    <>
      <main>

        <Link href={`/${lng}`}>
          <button type="button">
            {t('back-to-home')}
          </button>
        </Link>
      </main>
      <LanguageSwitcher lng={lng} path="/second-page" />
    </>
  )
}