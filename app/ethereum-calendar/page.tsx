import { EthereumCalendar } from "@/components/ethereum/ethereum-calendar"

export const metadata = {
  title: "CoinWait - Ethereum Price Calendar",
  description: "Track Ethereum's daily price changes on a calendar view",
}

export default function EthereumCalendarPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-1 sm:p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-6 text-bitcoin-dark dark:text-white text-center">
          Ethereum Price Calendar
        </h1>
        <EthereumCalendar />
      </div>
    </main>
  )
}

