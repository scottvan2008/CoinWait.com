// app/[lng]/components/MultiLanguageComponent.tsx
'use client';

import { useTranslation } from '../../i18n/client';
import Image from 'next/image';
import Link from 'next/link';

export default function MultiLanguageComponent({ lng }: { lng: string }) {
    const { t } = useTranslation(lng);

    return (
        <div className="p-4 border rounded text-center">
            <section className="prose mb-12 max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-black mb-4">{t("what_is_block_halving")}</h2>
                <p className="text-black">{t("block_halving_explanation")}</p>

                <h2 className="text-2xl font-bold text-black mt-8 mb-4">{t("why_was_this_done")}</h2>
                <p className="text-black">{t("reason_for_block_halving")}</p>

                <h2 className="text-2xl font-bold text-black mt-8 mb-4">{t("predictable_monetary_supply")}</h2>
                <p className="text-black">{t("benefit_of_predictable_supply")}</p>

                <div className="my-8">
                    <Link href="/bitcoin-inflation-chart.png" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/bitcoin-inflation-chart.png"
                            alt={t("bitcoin_inflation_chart_alt")}
                            width={800}
                            height={400}
                            className="mx-auto rounded-lg shadow-lg cursor-pointer"
                        />
                    </Link>
                </div>

                <h2 className="text-2xl font-bold text-black mt-8 mb-4">{t("who_controls_issuance")}</h2>
                <p className="text-black">{t("issuance_control_explanation")}</p>

                <h2 className="text-2xl font-bold text-black mt-8 mb-4">{t("past_halving_dates")}</h2>
                <ul className="space-y-4">
                    {[
                        {
                            date: "28th of November, 2012",
                            height: "210,000",
                            link: "000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e",
                        },
                        {
                            date: "9th of July, 2016",
                            height: "420,000",
                            link: "000000000000000002cce816c0ab2c5c269cb081896b7dcb34b8422d6b74ffa1",
                        },
                        {
                            date: "11th of May, 2020",
                            height: "630,000",
                            link: "000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d",
                        },
                        {
                            date: "20th of April, 2024",
                            height: "840,000",
                            link: "0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
                        },
                    ].map((event, index) => (
                        <li
                            key={index}
                            className="bg-sky-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-sky-100"
                        >
                            <p className="text-sm font-medium text-black mb-1">
                                {t(`ordinal_${index}`, { date: event.date })}
                            </p>
                            <p className="text-xl font-semibold text-black break-words">
                                {t("block_height")}{" "}
                                <Link
                                    href={`https://www.blockchain.com/explorer/blocks/btc/${event.link}`}
                                    className="text-sky-600 hover:text-sky-800"
                                >
                                    {event.height}
                                </Link>
                            </p>
                        </li>
                    ))}
                </ul>

                <h2 className="text-2xl font-bold text-black mt-8 mb-4">{t("past_halving_price_performance")}</h2>
                <p className="text-black">{t("price_performance_debate")}</p>

                <div className="my-8">
                    <Link href="/tz7lSIL0.png" target="_blank" rel="noopener noreferrer">
                        <Image
                            src="/tz7lSIL0.png"
                            alt={t("bitcoin_halving_chart_alt")}
                            width={1000}
                            height={500}
                            className="mx-auto rounded-lg shadow-lg cursor-pointer"
                        />
                    </Link>
                </div>
            </section>
        </div>
    );
}