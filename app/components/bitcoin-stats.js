"use client"

import { useState, useEffect } from "react"

export function BitcoinStats() {
  const [stats, setStats] = useState({
    totalBitcoins: 19816869,
    bitcoinPrice: 104410.0,
    marketCap: 2069079266187.5,
    nextBlockHalf: 168602,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prevStats) => ({
        ...prevStats,
        totalBitcoins: prevStats.totalBitcoins + 0.00520833, // Approx. 450 BTC per day
        nextBlockHalf: prevStats.nextBlockHalf - 0.00069444, // Approx. 144 blocks per day
      }))
    }, 1000) // Update every second

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Bitcoin Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatItem
          label="Total Bitcoins in circulation"
          value={stats.totalBitcoins.toLocaleString(undefined, { maximumFractionDigits: 8 })}
        />
        <StatItem label="Total Bitcoins to ever be produced" value="21,000,000" />
        <StatItem label="Percentage of total Bitcoins mined" value="94.37%" />
        <StatItem label="Total Bitcoins left to mine" value="1,183,131" />
        <StatItem label="Total Bitcoins left to mine until next blockhalf" value="526,881" />
        <StatItem label="Bitcoin price (USD)" value={`$${stats.bitcoinPrice.toLocaleString()}`} />
        <StatItem label="Market capitalization (USD)" value={`$${stats.marketCap.toLocaleString()}`} />
        <StatItem label="Bitcoins generated per day" value="450" />
        <StatItem label="Bitcoins generated per day after the next block halving event" value="225" />
        <StatItem label="Bitcoin inflation rate per annum" value="0.83%" />
        <StatItem label="Bitcoin inflation rate per annum after the next block halving event" value="0.40%" />
        <StatItem label="Bitcoin inflation per day (USD)" value="$46,984,500" />
        <StatItem label="Bitcoin inflation per day after the next block halving event (USD)" value="$23,492,250" />
        <StatItem
          label="Bitcoin inflation until next blockhalf event based on current price (USD)"
          value="$55,011,671,313"
        />
        <StatItem label="Bitcoin block reward (USD)" value="$326,281.25" />
        <StatItem label="Total blocks" value="881,398" />
        <StatItem
          label="Blocks until mining reward is halved"
          value={stats.nextBlockHalf.toLocaleString(undefined, { maximumFractionDigits: 5 })}
        />
        <StatItem label="Total number of block reward halvings" value="4" />
        <StatItem label="Approximate block generation time" value="10.00 minutes" />
        <StatItem label="Approximate blocks generated per day" value="144" />
        <StatItem label="Difficulty" value="108,105,433,845,147" />
        <StatItem label="Hash rate" value="845.13 Exahashes/s" />
        <StatItem label="Current activated soft forks" value="bip34,bip66,bip65,csv,segwit,taproot" />
        <StatItem label="Current pending soft forks" value="-" />
        <StatItem label="Next retarget period block height" value="883008" />
        <StatItem label="Blocks to mine until next difficulty retarget" value="1610" />
        <StatItem label="Next difficulty retarget ETA" value="11 days, 4 hours, 19 minutes" />
      </div>
    </div>
  )
}

function StatItem({ label, value }) {
  return (
    <div className="border-b border-gray-200 py-2">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

