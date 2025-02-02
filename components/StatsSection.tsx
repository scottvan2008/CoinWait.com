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
  const [dataState, setDataState] = useState<"loading" | "error" | "success">("loading")

  // Function to calculate the block reward based on block height
  const calculateBlockReward = (currentBlockHeight: number): number => {
    const halvingInterval = 210000;
    const initialReward = 50;
    const halvings = Math.floor(currentBlockHeight / halvingInterval);
    return initialReward / Math.pow(2, halvings);
  };

  // Function to calculate the total bitcoins mined based on halvings
  const calculateBitcoinsCirculation = (totalBlocks: number): string => {
    const halvingIntervals = [210000, 420000, 630000, 840000, 1050000, 1260000] // Define block intervals for each halving
    const rewards = [50, 25, 12.5, 6.25, 3.125, 1.5625] // Define the block rewards for each halving period

    let bitcoinsMined = 0
    let previousHalvingBlock = 0

    for (let i = 0; i < halvingIntervals.length; i++) {
      if (totalBlocks > halvingIntervals[i]) {
        const blocksMinedInCurrentPeriod = halvingIntervals[i] - previousHalvingBlock
        bitcoinsMined += blocksMinedInCurrentPeriod * rewards[i]
        previousHalvingBlock = halvingIntervals[i]
      } else {
        bitcoinsMined += (totalBlocks - previousHalvingBlock) * rewards[i]
        break
      }
    }

    if (totalBlocks > halvingIntervals[halvingIntervals.length - 1]) {
      bitcoinsMined += (totalBlocks - halvingIntervals[halvingIntervals.length - 1]) * rewards[rewards.length - 1]
    }

    return bitcoinsMined.toLocaleString()
  }

  // Function to calculate the number of blocks until the next halving
  const calculateBitcoinsUntilNextHalving = (currentBlockHeight: number): string => {
    const halvingInterval = 210000 // Blocks per halving
    const nextHalvingBlock = Math.ceil(currentBlockHeight / halvingInterval) * halvingInterval // The next halving block number
    const blocksUntilNextHalving = nextHalvingBlock - currentBlockHeight // The number of blocks left until the next halving
    return blocksUntilNextHalving.toLocaleString() // Return as a formatted string
  }

  //Helper function to calculate next retarget ETA
  function calculateNextRetargetETA(currentBlockHeight: number, minutesBetweenBlocks: number) {
    const blocksUntilRetarget = 2016 - (currentBlockHeight % 2016)
    const minutesUntilRetarget = blocksUntilRetarget * minutesBetweenBlocks
    const retargetDate = new Date(Date.now() + minutesUntilRetarget * 60000)
    return retargetDate.toUTCString()
  }

  const getFallbackData = () => {
    // Return some static fallback data
    return {
      bitcoinPrice: "$30,000.00",
      totalBitcoinsCirculation: "19,000,000",
      totalBitcoinsProduced: "21,000,000",
      percentageMined: "90.48%",
      bitcoinsLeftToMine: "2,000,000",
      bitcoinsUntilNextHalving: "100,000",
      marketCap: "$570,000,000,000",
      bitcoinsPerDay: "450",
      bitcoinsPerDayAfterHalving: "225",
      inflationRateAnnual: "0.83%",
      inflationRateAfterHalving: "0.40%",
      inflationPerDay: "$67500.00",
      inflationPerDayAfterHalving: "$33750.00",
      inflationUntilNextHalving: "$6250000.00",
      blockReward: "$6250.00",
      totalBlocks: "780000",
      blocksUntilHalving: "130000",
      totalHalvings: "4",
      blockGenerationTime: "9.75 minutes",
      blocksPerDay: "144",
      difficulty: "30000000000000",
      hashRate: "200.00 EH/s",
      activatedSoftForks: "bip34,bip66,bip65,csv,segwit,taproot",
      pendingSoftForks: "",
      nextRetargetHeight: "883008",
      blocksUntilRetarget: "1000",
      nextRetargetETA: "Mon, 27 Nov 2023 16:15:00 GMT",
    }
  }

  useEffect(() => {
    async function fetchData(retryCount = 0) {
      setDataState("loading")
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const [priceResponse, statsResponse] = await Promise.all([
          fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd", {
            signal: controller.signal,
          }),
          fetch("https://api.blockchain.info/stats", { signal: controller.signal }),
        ])

        clearTimeout(timeoutId)

        if (!priceResponse.ok) {
          throw new Error(`Price API error: ${priceResponse.status} ${priceResponse.statusText}`)
        }
        if (!statsResponse.ok) {
          throw new Error(`Stats API error: ${statsResponse.status} ${statsResponse.statusText}`)
        }

        const bitcoinData = await priceResponse.json()
        const marketData = await statsResponse.json()

        const currentPrice = bitcoinData.bitcoin.usd
        const currentBlockHeight = marketData.n_blocks_total
        const blocksUntilHalving = 210000 - (currentBlockHeight % 210000)

        // Calculate the current block reward based on the block height
        const currentBlockReward = calculateBlockReward(currentBlockHeight);
        const nextBlockReward = currentBlockReward / 2

        const totalBitcoinsCirculation = calculateBitcoinsCirculation(currentBlockHeight)
        const bitcoinsUntilNextHalving = blocksUntilHalving * currentBlockReward
        const marketCap = currentPrice * Number(totalBitcoinsCirculation.replace(/,/g, ""))
        const inflationPerDay = currentBlockReward * 144 * currentPrice // 144 blocks per day on average
        const inflationPerDayAfterHalving = nextBlockReward * 144 * currentPrice
        const inflationUntilNextHalving = bitcoinsUntilNextHalving * currentPrice
        const blockReward = currentBlockReward * currentPrice

        setStatsData({
          bitcoinPrice: `$${bitcoinData.bitcoin.usd.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          totalBitcoinsCirculation,
          totalBitcoinsProduced: "21,000,000",
          percentageMined: `${((Number(totalBitcoinsCirculation.replace(/,/g, "")) / 21000000) * 100).toFixed(2)}%`,
          bitcoinsLeftToMine: `${(21000000 - Number(totalBitcoinsCirculation.replace(/,/g, ""))).toLocaleString()}`,
          bitcoinsUntilNextHalving: bitcoinsUntilNextHalving.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          marketCap: `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          bitcoinsPerDay: "450",
          bitcoinsPerDayAfterHalving: "225",
          inflationRateAnnual: "0.83%",
          inflationRateAfterHalving: "0.40%",
          inflationPerDay: `$${inflationPerDay.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          inflationPerDayAfterHalving: `$${inflationPerDayAfterHalving.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          inflationUntilNextHalving: `$${inflationUntilNextHalving.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          blockReward: `$${blockReward.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
          totalBlocks: marketData.n_blocks_total.toLocaleString(),
          blocksUntilHalving: blocksUntilHalving.toLocaleString(),
          totalHalvings: "4",
          blockGenerationTime: `${marketData.minutes_between_blocks.toFixed(2)} minutes`,
          blocksPerDay: "144",
          difficulty: marketData.difficulty.toLocaleString(),
          hashRate: `${(marketData.hash_rate / 1e9).toFixed(2)} EH/s`,
          activatedSoftForks: "bip34,bip66,bip65,csv,segwit,taproot",
          pendingSoftForks: "",
          nextRetargetHeight: "883008",
          blocksUntilRetarget: (2016 - (currentBlockHeight % 2016)).toLocaleString(),
          nextRetargetETA: calculateNextRetargetETA(currentBlockHeight, marketData.minutes_between_blocks),
        })
        setDataState("success")
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error);
        
        // 使用 instanceof 检查是否为 DOMException
        if (error instanceof DOMException && error.name === "AbortError") {
          console.error("Request timed out");
        } else if (error instanceof Error && error.name === "AbortError") {
          console.error("Request aborted");
        }
      
        if (retryCount < 3) {
          console.log(`Retrying... Attempt ${retryCount + 1}`);
          setTimeout(() => fetchData(retryCount + 1), 2000);
        } else {
          setStatsData(null);
          setDataState("error");
        }
      }
    }

    fetchData()

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 300000)
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
      {dataState === "loading" && <p>Loading...</p>}
      {dataState === "error" && (
        <>
          <p className="text-red-500 mb-4">
            Error loading live data. Please try again later or check your internet connection. Showing fallback data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(getFallbackData()).map(([key, value], index) => (
              <div
                key={index}
                className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100"
              >
                <p className="text-sm font-medium text-gray-600 mb-1">{t(key)}</p>
                <p className="text-xl font-semibold text-gray-900 break-words">{value}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {dataState === "success" && (
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
      )}
    </section>
  )
}

