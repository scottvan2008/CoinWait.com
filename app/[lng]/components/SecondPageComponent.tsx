import Link from 'next/link';
import { getTranslation } from '../../i18n';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

interface SecondPageProps {
  lng: string;
}

export default async function SecondPageComponent({ lng }: SecondPageProps) {
  const t = await getTranslation(lng, 'second-page'); // ✅ Now works in server components!

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
  );
}
