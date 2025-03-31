import { EthereumMonthlyReturnsTable } from "@/components/ethereum/monthly-returns-table"
import { EthereumQuarterlyReturnsTable } from "@/components/ethereum/quarterly-returns-table"

export const metadata = {
  title: "CoinWait - Ethereum Performance Analysis",
  description: "Track Ethereum's quarterly and monthly price changes over the years",
}

export default function EthereumPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-bitcoin-dark dark:text-white text-center">
          Ethereum Performance Analysis
        </h1>

        <div className="mb-8">
          <EthereumQuarterlyReturnsTable />
        </div>

        <div>
          <EthereumMonthlyReturnsTable />
        </div>
      </div>
    </main>
  )
}

