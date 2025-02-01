import { useTranslation } from "react-i18next"

export default function StatsSection() {
  const { t } = useTranslation()

  const stats = [
    { label: t("totalBitcoinsCirculation"), value: "19,817,022" },
    { label: t("totalBitcoinsProduced"), value: "21,000,000" },
    { label: t("percentageMined"), value: "94.37%" },
    { label: t("bitcoinsLeftToMine"), value: "1,182,978" },
    { label: t("bitcoinsUntilNextHalving"), value: "526,728" },
    { label: t("bitcoinPrice"), value: "$104,690.00" },
    { label: t("marketCap"), value: "$2,074,644,020,093.75" },
    { label: t("bitcoinsPerDay"), value: "450" },
    { label: t("bitcoinsPerDayAfterHalving"), value: "225" },
    { label: t("inflationRateAnnual"), value: "0.83%" },
    { label: t("inflationRateAfterHalving"), value: "0.40%" },
    { label: t("inflationPerDay"), value: "$47,110,500" },
    { label: t("inflationPerDayAfterHalving"), value: "$23,555,250" },
    { label: t("inflationUntilNextHalving"), value: "$55,143,167,406" },
    { label: t("blockReward"), value: "$327,156.25" },
    { label: t("totalBlocks"), value: "881,447" },
    { label: t("blocksUntilHalving"), value: "168,553" },
    { label: t("totalHalvings"), value: "4" },
    { label: t("blockGenerationTime"), value: "10.00 minutes" },
    { label: t("blocksPerDay"), value: "144" },
    { label: t("difficulty"), value: "108,105,433,845,147" },
    { label: t("hashRate"), value: "839.97 Exahashes/s" },
    { label: t("activatedSoftForks"), value: "bip34,bip66,bip65,csv,segwit,taproot" },
    { label: t("pendingSoftForks"), value: "" },
    { label: t("nextRetargetHeight"), value: "883008" },
    { label: t("blocksUntilRetarget"), value: "1561" },
    { label: t("nextRetargetETA"), value: "10 days, 20 hours, 9 minutes" },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900" id="stats">
        {t("bitcoinStats")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100"
          >
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-gray-900 break-words">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}