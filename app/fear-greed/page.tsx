import { FearGreedIndex } from "@/components/fear-greed/fear-greed-index"

export const metadata = {
  title: "CoinWait - Crypto Fear & Greed Index",
  description: "Track the cryptocurrency market sentiment with the Crypto Fear & Greed Index",
}

export default function FearGreedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-1 sm:p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <FearGreedIndex />
      </div>
    </main>
  )
}

