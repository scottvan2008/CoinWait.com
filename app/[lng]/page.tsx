import Link from 'next/link'

import { languages, fallbackLng } from '../i18n/settings'
import { useTranslation } from '../i18n'

import Header from './components/Header'
import Footer from './components/Footer'
import { CountdownTimer } from './components/CountdownTimer'
// import { InfoSection } from "./components/InfoSection"
import { BitcoinStats } from "./components/BitcoinStats"
import MultiLanguageComponent from './components/MultiLanguageComponent'

export default async function Page({ params }: {
  params: Promise<{ lng: string; }>;
}) {
  let { lng } = await params
  if (languages.indexOf(lng) < 0) lng = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng)

  return (
    <>
      <Header lng={lng} />
      <main className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-12">

        


          <CountdownTimer />
        </div>

        <hr className="my-5 w-11/12 border-t border-gray-300" />
        <div className="flex space-x-4">
          <Link href={`/${lng}/second-page`}>
            <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {t('to-second-page')}
            </button>
          </Link>
          <Link href={`/${lng}/client-page`}>
            <button type="button" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              {t('to-client-page')}
            </button>
          </Link>
        </div>

        
        <MultiLanguageComponent lng={lng} />
        {/* <InfoSection /> */}
        <BitcoinStats />
        
      </main>
      <Footer />
    </>
  )
}