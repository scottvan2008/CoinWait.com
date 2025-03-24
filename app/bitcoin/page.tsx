import { BitcoinHalvingCountdown } from "@/components/bitcoin/halving-countdown"
import { BitcoinStatistics } from "@/components/bitcoin/statistics"

export const metadata = {
  title: "CoinWait - Bitcoin Halving Tracker",
  description: "Track the Bitcoin halving countdown and statistics in real-time",
}

export default function BitcoinPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <BitcoinHalvingCountdown />
        <BitcoinStatistics />
      </div>
    </main>
  )
}

