import { CountdownTimer } from "./components/countdown-timer"
import { InfoSection } from "./components/info-section"
import { InflationGraph } from "./components/inflation-graph"

export default function Page() {
  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800 md:text-4xl">
          Bitcoin Block Reward Halving Countdown
        </h1>

        <CountdownTimer targetDate="2028-04-14T16:58:02Z" />

        <div className="mt-12 space-y-8">
          <InfoSection
            title="What is a block halving event?"
            content="As part of Bitcoin's coin issuance, miners are rewarded a certain amount of bitcoins whenever a block is produced (approximately every 10 minutes). When Bitcoin first started, 50 Bitcoins per block were given as a reward to miners. After every 210,000 blocks are mined (approximately every 4 years), the block reward halves and will keep on halving until the block reward per block becomes 0 (approximately by year 2140). As of now, the block reward is 3.125 coins per block and will decrease to 1.5625 coins per block post halving."
          />

          <InfoSection
            title="Why was this done?"
            content="Bitcoin was designed as a deflationary currency. Like gold, the premise is that over time, the issuance of bitcoins will decrease and thus become scarcer over time. As bitcoins become scarcer and if demand for them increases over time, Bitcoin can be used as a hedge against inflation as the price, guided by price equilibrium is bound to increase. On the flip side, fiat currencies (like the US dollar), inflate over time as its monetary supply increases, leading to a decrease in purchasing power. This is known as monetary debasement by inflation. A simple example would be to compare housing prices decades ago to now and you'll notice that they've increased over time!"
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Predictable monetary supply</h2>
            <p className="text-gray-600">
              Since we know Bitcoin's issuance over time, people can rely on programmed/controlled supply. This is
              helpful to understand what the current inflation rate of Bitcoin is, what the future inflation rate will
              be at a specific point in time, how many Bitcoins are in circulation and how many remain left to be mined.
            </p>
            <InflationGraph />
          </div>
        </div>
      </div>
    </main>
  )
}

