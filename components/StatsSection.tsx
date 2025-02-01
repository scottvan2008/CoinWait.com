import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

interface BitcoinStats {
  bitcoinPrice: string
  totalBitcoinsCirculation: string
  totalBitcoinsProduced: string
  percentageMined: string
  bitcoinsLeftToMine: string
  bitcoinsUntilNextHalving: string
  marketCap: string
  bitcoinsPerDay: string
  bitcoinsPerDayAfterHalving: string
  inflationRateAnnual: string
  inflationRateAfterHalving: string
  inflationPerDay: string
  inflationPerDayAfterHalving: string
  inflationUntilNextHalving: string
  blockReward: string
  totalBlocks: string
  blocksUntilHalving: string
  totalHalvings: string
  blockGenerationTime: string
  blocksPerDay: string
  difficulty: string
  hashRate: string
  activatedSoftForks: string
  pendingSoftForks: string
  nextRetargetHeight: string
  blocksUntilRetarget: string
  nextRetargetETA: string
}

export default function StatsSection() {
  const { t } = useTranslation()
  const [statsData, setStatsData] = useState<BitcoinStats | null>(null)

  // Function to calculate the total bitcoins mined based on halvings
  const calculateBitcoinsCirculation = (totalBlocks: number): string => {
    const halvingIntervals = [210000, 420000, 630000, 840000, 1050000, 1260000]; // Define block intervals for each halving
    const rewards = [50, 25, 12.5, 6.25, 3.125, 1.5625]; // Define the block rewards for each halving period

    let bitcoinsMined = 0;
    let previousHalvingBlock = 0;

    for (let i = 0; i < halvingIntervals.length; i++) {
      if (totalBlocks > halvingIntervals[i]) {
        const blocksMinedInCurrentPeriod = halvingIntervals[i] - previousHalvingBlock;
        bitcoinsMined += blocksMinedInCurrentPeriod * rewards[i];
        previousHalvingBlock = halvingIntervals[i];
      } else {
        bitcoinsMined += (totalBlocks - previousHalvingBlock) * rewards[i];
        break;
      }
    }

    if (totalBlocks > halvingIntervals[halvingIntervals.length - 1]) {
      bitcoinsMined += (totalBlocks - halvingIntervals[halvingIntervals.length - 1]) * rewards[rewards.length - 1];
    }

    return bitcoinsMined.toLocaleString();
  }

  // Function to calculate the number of blocks until the next halving
  const calculateBitcoinsUntilNextHalving = (currentBlockHeight: number): string => {
    const halvingInterval = 210000;  // Blocks per halving
    const nextHalvingBlock = Math.ceil(currentBlockHeight / halvingInterval) * halvingInterval;  // The next halving block number
    const blocksUntilNextHalving = nextHalvingBlock - currentBlockHeight;  // The number of blocks left until the next halving
    return blocksUntilNextHalving.toLocaleString();  // Return as a formatted string
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
        const bitcoinData = await response.json()

        const marketDataResponse = await fetch("https://api.blockchain.info/stats")
        const marketData = await marketDataResponse.json()

        // Calculate the total bitcoins in circulation based on blocks mined
        const totalBitcoinsCirculation = calculateBitcoinsCirculation(marketData.n_blocks_total)

        // Calculate the number of blocks left until the next halving
        const bitcoinsUntilNextHalving = calculateBitcoinsUntilNextHalving(marketData.n_blocks_total)

        // Here, I map your fetched data to match the entire stats array
        setStatsData({
          bitcoinPrice: `$${bitcoinData.bitcoin.usd.toLocaleString()}`,
          totalBitcoinsCirculation, // Use the calculated value
          totalBitcoinsProduced: "21,000,000", // This is static, as this is the maximum supply of Bitcoin
          percentageMined: `${((Number(totalBitcoinsCirculation.replace(/,/g, '')) / 21000000) * 100).toFixed(2)}%`, // Adjusted formula
          bitcoinsLeftToMine: `${(21000000 - Number(totalBitcoinsCirculation.replace(/,/g, ''))).toLocaleString()}`, // Subtract mined from total supply
          bitcoinsUntilNextHalving, // Use the dynamically calculated value
          marketCap: `$${(marketData.market_price_usd * marketData.n_blocks_total).toLocaleString()}`,
          bitcoinsPerDay: "450", // Placeholder value
          bitcoinsPerDayAfterHalving: "225", // Placeholder value
          inflationRateAnnual: "0.83%", // Placeholder, needs to be calculated from the market or halving data
          inflationRateAfterHalving: "0.40%", // Placeholder
          inflationPerDay: `$${marketData.market_price_usd * 6.25}`, // Placeholder based on market price * block reward
          inflationPerDayAfterHalving: `$${(marketData.market_price_usd * 3.125).toLocaleString()}`, // Placeholder after halving
          inflationUntilNextHalving: `$${(marketData.market_price_usd * 3.125 * 526728).toLocaleString()}`, // Placeholder
          blockReward: `$${(marketData.market_price_usd * 6.25).toLocaleString()}`,
          totalBlocks: marketData.n_blocks_total.toLocaleString(),
          blocksUntilHalving: "168,553", // Placeholder
          totalHalvings: "4", // Static as Bitcoin has had 4 halvings
          blockGenerationTime: `${marketData.minutes_between_blocks.toFixed(2)} minutes`,
          blocksPerDay: "144", // Placeholder, needs to be calculated based on block time
          difficulty: marketData.difficulty.toLocaleString(),
          hashRate: `${(marketData.hash_rate / 1e9).toFixed(2)} EH/s`, // Convert to Exahashes
          activatedSoftForks: "bip34,bip66,bip65,csv,segwit,taproot", // Static
          pendingSoftForks: "", // Static or needs an API for pending soft forks
          nextRetargetHeight: "883008", // Placeholder
          blocksUntilRetarget: "1561", // Placeholder
          nextRetargetETA: "10 days, 20 hours, 9 minutes", // Placeholder
        })
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error)
      }
    }

    fetchData()

    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: t("totalBitcoinsCirculation"), value: statsData?.totalBitcoinsCirculation || "Loading..." },
    { label: t("totalBitcoinsProduced"), value: statsData?.totalBitcoinsProduced || "Loading..." },
    { label: t("percentageMined"), value: statsData?.percentageMined || "Loading..." },
    { label: t("bitcoinsLeftToMine"), value: statsData?.bitcoinsLeftToMine || "Loading..." },
    { label: t("bitcoinsUntilNextHalving"), value: statsData?.bitcoinsUntilNextHalving || "Loading..." },
    { label: t("bitcoinPrice"), value: statsData?.bitcoinPrice || "Loading..." },
    { label: t("marketCap"), value: statsData?.marketCap || "Loading..." },
    { label: t("bitcoinsPerDay"), value: statsData?.bitcoinsPerDay || "Loading..." },
    { label: t("bitcoinsPerDayAfterHalving"), value: statsData?.bitcoinsPerDayAfterHalving || "Loading..." },
    { label: t("inflationRateAnnual"), value: statsData?.inflationRateAnnual || "Loading..." },
    { label: t("inflationRateAfterHalving"), value: statsData?.inflationRateAfterHalving || "Loading..." },
    { label: t("inflationPerDay"), value: statsData?.inflationPerDay || "Loading..." },
    { label: t("inflationPerDayAfterHalving"), value: statsData?.inflationPerDayAfterHalving || "Loading..." },
    { label: t("inflationUntilNextHalving"), value: statsData?.inflationUntilNextHalving || "Loading..." },
    { label: t("blockReward"), value: statsData?.blockReward || "Loading..." },
    { label: t("totalBlocks"), value: statsData?.totalBlocks || "Loading..." },
    { label: t("blocksUntilHalving"), value: statsData?.blocksUntilHalving || "Loading..." },
    { label: t("totalHalvings"), value: statsData?.totalHalvings || "Loading..." },
    { label: t("blockGenerationTime"), value: statsData?.blockGenerationTime || "Loading..." },
    { label: t("blocksPerDay"), value: statsData?.blocksPerDay || "Loading..." },
    { label: t("difficulty"), value: statsData?.difficulty || "Loading..." },
    { label: t("hashRate"), value: statsData?.hashRate || "Loading..." },
    { label: t("activatedSoftForks"), value: statsData?.activatedSoftForks || "Loading..." },
    { label: t("pendingSoftForks"), value: statsData?.pendingSoftForks || "Loading..." },
    { label: t("nextRetargetHeight"), value: statsData?.nextRetargetHeight || "Loading..." },
    { label: t("blocksUntilRetarget"), value: statsData?.blocksUntilRetarget || "Loading..." },
    { label: t("nextRetargetETA"), value: statsData?.nextRetargetETA || "Loading..." },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900" id="stats">
        {t("bitcoinStats")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100">
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-gray-900 break-words">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
