"use client"

import { Suspense, useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import Link from "next/link"
import { CountdownFlipper } from "@/components/countdown-flipper"
import StatsSection from "@/components/StatsSection"
import HalvingEvents from "@/components/HalvingEvents"
import i18n from "./i18n"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { useTranslationLoader } from "@/hooks/useTranslationLoader"
import Footer from "@/components/Footer";


function TranslatedContent() {
  const { isLoaded, currentLanguage } = useTranslationLoader()
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImageSrc, setModalImageSrc] = useState("")
  const [key, setKey] = useState(0)

  const changeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang)
  }, [])

  useEffect(() => {
    setKey((prevKey) => prevKey + 1)
  }, [])

  const openModal = useCallback((src: string) => {
    setModalImageSrc(src)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setModalImageSrc("")
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <main key={key} className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50} // Fixed width
            height={50} // Fixed height (adjust based on your logo's aspect ratio)
            className="mr-4"
          />
        </div>
        {/* Language Switcher */}
        <LanguageSwitcher currentLanguage={currentLanguage} onChangeLanguage={changeLanguage} />
      </div>

      {/* Main Content */}
      <div className="text-center mb-12">
  <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("welcome")}</h1>
  <CountdownFlipper  />
</div>

      <section className="prose max-w-none mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("whatIsHalving")}</h2>
        <p className="text-gray-700">{t("halvingExplanation")}</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("whyHalving")}</h2>
        <p className="text-gray-700">{t("whyHalvingExplanation")}</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("predictableSupply")}</h2>
        <p className="text-gray-700">{t("predictableSupplyExplanation")}</p>

        <div className="my-8">
          <div onClick={() => openModal("/bitcoin-inflation-chart.png")} className="cursor-pointer">
            <Image
              src="/bitcoin-inflation-chart.png"
              alt={t("bitcoinInflationChartAlt")}
              width={800}
              height={400}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("whoControls")}</h2>
        <p className="text-gray-700">{t("whoControlsExplanation")}</p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("pastHalvingEvents")}</h2>
        <HalvingEvents />

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{t("pastHalvingPerformance")}</h2>
        <p className="text-gray-700">{t("pastHalvingExplanation")}</p>

        <div className="my-8">
          <div onClick={() => openModal("/tz7lSIL0.png")} className="cursor-pointer">
            <Image
              src="/tz7lSIL0.png"
              alt={t("bitcoinHalvingChartAlt")}
              width={1000}
              height={500}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <StatsSection />



      <Footer />

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors"
              aria-label={t("closeModal")}
            >
              X
            </button>
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={modalImageSrc || "/placeholder.svg"}
                alt={t("modalImageAlt")}
                width={800}
                height={600}
                className="max-w-full max-h-full"
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TranslatedContent />
    </Suspense>
  )
}