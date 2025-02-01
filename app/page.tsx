"use client"; // Mark this component as a Client Component
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { CountdownFlipper } from "@/components/countdown-flipper";
import StatsSection from "@/components/StatsSection";
import HalvingEvents from "@/components/HalvingEvents"; // Import the new HalvingEvents component
import i18n from './i18n'; // Import from the separate file

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  // Function to open the modal with the clicked image
  const openModal = (src: string) => {
    setModalImageSrc(src);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
  };

  const { t } = useTranslation();

  const [language, setLanguage] = useState("English");
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    setLanguage(e.target.value === "en" ? "English" : "中文");

  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div>
        <select name='language' onChange={onChange}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">{t("welcome")}</h1>

        <CountdownFlipper targetDate="2028-04-14 15:19:14" labels={["Days", "Hours", "Minutes", "Seconds"]} />

        <div className="text-lg mt-6 text-gray-700">
          Reward-Drop ETA date: <strong className="font-semibold">14 Apr 2028 15:19:14 UTC</strong>
        </div>
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
              alt="Bitcoin inflation chart"
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
              alt="Bitcoin halving chart"
              width={1000}
              height={500}
              className="mx-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      <StatsSection />

      <footer className="text-center py-8 border-t border-gray-200">
        <div>
          <Image src="/bitcoin.png" alt="Bitcoin logo" width={100} height={100} className="mx-auto mb-4" />
        </div>
        <h2>
          <Link
            href="https://www.litecoinblockhalf.com"
            className="text-2xl text-blue-600 hover:text-blue-800 transition-colors"
          >
            {t("litecoinHalving")}
          </Link>
        </h2>
      </footer>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-colors"
              aria-label="Close modal"
            >
              X
            </button>
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={modalImageSrc || "/placeholder.svg"}
                alt="Modal Image"
                width={800}  // Set a reasonable default width
                height={600} // Set a reasonable default height
                className="max-w-full max-h-full"
                style={{ objectFit: "contain" }}
              />
              
            </div>
          </div>
        </div>
      )}
    </main>
  );
}