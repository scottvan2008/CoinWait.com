/* eslint-disable react/no-unescaped-entities */

// pages/index.tsx
import Image from "next/image";
import Link from "next/link";
import { CountdownFlipper } from "@/components/countdown-flipper";
import StatsSection from "@/components/StatsSection";
import HalvingEvents from "@/components/HalvingEvents"; // Import the new HalvingEvents component

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">
          Bitcoin Block Reward Halving Countdown
        </h1>

        {/* Countdown Timer */}
        <CountdownFlipper
          targetDate="2028-04-14 15:19:14"
          labels={["Days", "Hours", "Minutes", "Seconds"]}
        />

        {/* Reward Drop ETA */}
        <div className="text-lg mt-6 text-gray-700">
          Reward-Drop ETA date:{" "}
          <strong className="font-semibold">14 Apr 2028 15:19:14 UTC</strong>
        </div>
      </div>

      {/* Content Section */}
      <section className="prose max-w-none mb-12">
        {/* What is a Block Halving Event? */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          What is a block halving event?
        </h2>
        <p className="text-gray-700">
          As part of Bitcoin's coin issuance, miners are rewarded a certain
          amount of bitcoins whenever a block is produced (approximately every
          10 minutes). When Bitcoin first started, 50 Bitcoins per block were
          given as a reward to miners. After every 210,000 blocks are mined
          (approximately every 4 years), the block reward halves and will keep
          on halving until the block reward per block becomes 0 (approximately
          by year 2140). As of now, the block reward is{" "}
          <b className="font-semibold">3.125</b> coins per block and will
          decrease to <b className="font-semibold">1.5625</b> coins per block
          post halving.
        </p>

        {/* Why was this done? */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Why was this done?
        </h2>
        <p className="text-gray-700">
          Bitcoin was designed as a deflationary currency. Like gold, the
          premise is that over time, the issuance of bitcoins will decrease and
          thus become scarcer over time. As bitcoins become scarcer and if
          demand for them increases over time, Bitcoin can be used as a hedge
          against inflation as the price, guided by price equilibrium, is bound
          to increase. On the flip side, fiat currencies (like the US dollar),
          inflate over time as their monetary supply increases, leading to a
          decrease in purchasing power. This is known as monetary debasement by
          inflation. A simple example would be to compare housing prices decades
          ago to now and you'll notice that they've increased over time!
        </p>

        {/* Predictable Monetary Supply */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Predictable monetary supply
        </h2>
        <p className="text-gray-700">
          Since we know Bitcoin's issuance over time, people can rely on
          programmed/controlled supply. This is helpful to understand what the
          current inflation rate of Bitcoin is, what the future inflation rate
          will be at a specific point in time, how many Bitcoins are in
          circulation, and how many remain left to be mined.
        </p>

        {/* Bitcoin Inflation Chart */}
        <div className="my-8">
          <Image
            src="/bitcoin-inflation-chart.png"
            alt="Bitcoin inflation chart"
            width={800}
            height={400}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Who Controls the Issuance of Bitcoin? */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Who controls the issuance of Bitcoin?
        </h2>
        <p className="text-gray-700">
          The network itself controls the issuance of Bitcoins, derived by
          consensus through all Bitcoin participants. Ever since Bitcoin was
          first designed, the following consensus rules exist to this day:
        </p>
        <ul className="list-disc list-inside text-gray-700">
          <li>21,000,000 Bitcoins to ever be produced</li>
          <li>Target of 10-minute block intervals</li>
          <li>
            Halving event occurring every 210,000 blocks (approximately every 4
            years)
          </li>
          <li>
            Block reward which starts at 50 and halves continually every halving
            event until it reaches 0 (approximately by year 2140)
          </li>
        </ul>
        <p className="text-gray-700">
          Any change to these parameters requires all Bitcoin participants to
          agree by consensus to approve the change.
        </p>

        {/* Past Halving Event Dates */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Past halving event dates
        </h2>
        <HalvingEvents /> {/* Use the HalvingEvents component here */}

        {/* Past Halving Price Performance */}
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Past halving price performance
        </h2>
        <p className="text-gray-700">
          It is always a debate on what Bitcoin will do in terms of pricing for
          a halving event. Some people believe that the halving is already
          priced in by the market and thus there's no expectation for the price
          to do anything. Others believe that due to price equilibrium, a
          halving of supply should cause an increase in price if demand for
          Bitcoins is equal or greater than what it was before the halving
          event. Below is a chart showing past price performance of the last
          three halving events:
        </p>

        {/* Bitcoin Halving Chart */}
        <div className="my-8">
          <Image
            src="/tz7lSIL0.png"
            alt="Bitcoin halving chart"
            width={1000}
            height={500}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Footer */}
      <footer className="text-center py-8 border-t border-gray-200">
        <Image
          src="/bitcoin.png"
          alt="Bitcoin logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h2>
          <Link
            href="https://www.litecoinblockhalf.com"
            className="text-2xl text-blue-600 hover:text-blue-800 transition-colors"
          >
            Litecoin Block Halving Countdown
          </Link>
        </h2>
      </footer>
    </main>
  );
}