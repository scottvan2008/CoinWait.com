import { CryptoDashboard } from "@/components/crypto/crypto-dashboard"

export const metadata = {
  title: "CoinWait - Cryptocurrency Market",
  description: "Track cryptocurrency prices and market data in real-time",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-bitcoin-dark dark:text-white text-center">
          Cryptocurrency Market
        </h1>
        <CryptoDashboard />
      </div>
    </main>
  )
}

