import { ExchangeList } from "@/components/exchanges/exchange-list"

export const metadata = {
  title: "CoinWait - Cryptocurrency Exchanges",
  description: "Browse and compare the top cryptocurrency exchanges by volume, trust score, and more",
}

export default function ExchangesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 sm:p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-bitcoin-dark dark:text-white text-center">
          Cryptocurrency Exchanges
        </h1>
        <ExchangeList />
      </div>
    </main>
  )
}

