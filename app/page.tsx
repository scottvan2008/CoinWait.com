/* eslint-disable react/no-unescaped-entities */

import Image from "next/image"
import { CountdownFlipper } from "@/components/countdown-flipper"
import Link from "next/link"
import StatsSection from "@/components/StatsSection"; // Import the new StatsSection component



const halvingEvents = [
  {
    date: "28th of November, 2012 (UTC)",
    height: "210,000",
    link: "https://www.blockchain.com/explorer/blocks/btc/000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e",
  },
  {
    date: "9th of July, 2016 (UTC)",
    height: "420,000",
    link: "https://www.blockchain.com/explorer/blocks/btc/000000000000000002cce816c0ab2c5c269cb081896b7dcb34b8422d6b74ffa1",
  },
  {
    date: "11th of May, 2020 (UTC)",
    height: "630,000",
    link: "https://www.blockchain.com/explorer/blocks/btc/000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d",
  },
  {
    date: "20th of April, 2024 (UTC)",
    height: "840,000",
    link: "https://www.blockchain.com/explorer/blocks/btc/0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
  },
]

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bitcoin Block Reward Halving Countdown</h1>

        <CountdownFlipper targetDate="2028-04-14 15:19:14" labels={["Days", "Hours", "Minutes", "Seconds"]} />

        <div className="text-lg mb-12">
          Reward-Drop ETA date: <strong>14 Apr 2028 15:19:14 UTC</strong>
        </div>
      </div>

      <section className="prose max-w-none mb-12">
        <h2>What is a block halving event?</h2>
        <p>
          As part of Bitcoin's coin issuance, miners are rewarded a certain amount of bitcoins whenever a block is
          produced (approximately every 10 minutes). When Bitcoin first started, 50 Bitcoins per block were given as a
          reward to miners. After every 210,000 blocks are mined (approximately every 4 years), the block reward halves
          and will keep on halving until the block reward per block becomes 0 (approximately by year 2140). As of now,
          the block reward is <b>3.125</b> coins per block and will decrease to
          <b>1.5625</b> coins per block post halving.
        </p>

        <h2>Why was this done?</h2>
        <p>
          Bitcoin was designed as a deflationary currency. Like gold, the premise is that over time, the issuance of
          bitcoins will decrease and thus become scarcer over time. As bitcoins become scarcer and if demand for them
          increases over time, Bitcoin can be used as a hedge against inflation as the price, guided by price
          equilibrium is bound to increase. On the flip side, fiat currencies (like the US dollar), inflate over time as
          its monetary supply increases, leading to a decrease in purchasing power. This is known as monetary debasement
          by inflation. A simple example would be to compare housing prices decades ago to now and you'll notice that
          they've increased over time!
        </p>

        <h2>Predictable monetary supply</h2>
        <p>
          Since we know Bitcoin's issuance over time, people can rely on programmed/controlled supply. This is helpful
          to understand what the current inflation rate of Bitcoin is, what the future inflation rate will be at a
          specific point in time, how many Bitcoins are in circulation and how many remain left to be mined.
        </p>

        <div className="my-8">
          <Image
            src="/bitcoin-inflation-chart.png"
            alt="Bitcoin inflation chart"
            width={800}
            height={400}
            className="mx-auto"
          />
        </div>

        <h2>Who controls the issuance of Bitcoin?</h2>
        <p>
          The network itself controls the issuance of Bitcoins, derived by consensus through all Bitcoin participants.
          Ever since Bitcoin was first designed, the following consensus rules exist to this day:
        </p>
        <ul>
          <li>21,000,000 Bitcoins to ever be produced</li>
          <li>Target of 10-minute block intervals</li>
          <li>Halving event occurring every 210,000 blocks (approximately every 4 years)</li>
          <li>
            Block reward which starts at 50 and halves continually every halving event until it reaches 0 (approximately
            by year 2140)
          </li>
        </ul>
        <p>
          Any change to these parameters requires all Bitcoin participants to agree by consensus to approve the change.
        </p>

        <h2>Past halving event dates</h2>
        <ul>
          {halvingEvents.map((event, index) => (
            <li key={index}>
              The {index === 0 ? "first" : index === 1 ? "second" : index === 2 ? "third" : "fourth"} halving event
              occurred on the {event.date} at block height{" "}
              <Link href={event.link} className="text-blue-600 hover:text-blue-800">
                {event.height}
              </Link>
            </li>
          ))}
        </ul>

        <h2>Past halving price performance</h2>
        <p>
          It is always a debate on what Bitcoin will do in terms of pricing for a halving event. Some people believe
          that the halving is already priced in by the market and thus there's no expectation for the price to do
          anything. Others believe that due to price equilibrium, a halving of supply should cause an increase in price
          if demand for Bitcoins is equal or greater than what it was before the halving event. Below is a chart showing
          past price performance of the last three halving events:
        </p>

        <div className="my-8">
          <Image
            src="/tz7lSIL0.png"
            alt="Bitcoin halving chart"
            width={1000}
            height={500}
            className="mx-auto"
          />
        </div>
      </section>

      <StatsSection />


      <footer className="text-center py-8">
        <Image src="/bitcoin.png" alt="Bitcoin logo" width={100} height={100} className="mx-auto mb-4" />
        <h2>
          <Link href="https://www.litecoinblockhalf.com" className="text-2xl text-blue-600 hover:text-blue-800">
            Litecoin Block Halving Countdown
          </Link>
        </h2>
      </footer>
    </main>
  )
}

