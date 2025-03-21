import { BitcoinHalvingCountdown } from "@/components/bitcoin/halving-countdown"
import { BitcoinStatistics } from "@/components/bitcoin/statistics"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-24 md:p-8 md:pt-24 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <BitcoinHalvingCountdown />
        <BitcoinStatistics />
      </div>
    </main>
  )
}

