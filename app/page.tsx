import Image from "next/image"
import { CountdownFlipper } from "@/components/countdown-flipper"
import { StatsTable } from "@/components/stats-table"
import Link from "next/link"

const stats = [
  { label: "Total Bitcoins in circulation:", value: "19,817,022" },
  { label: "Total Bitcoins to ever be produced:", value: "21,000,000" },
  { label: "Percentage of total Bitcoins mined:", value: "94.37%" },
  { label: "Total Bitcoins left to mine:", value: "1,182,978" },
  { label: "Total Bitcoins left to mine until next blockhalf:", value: "526,728" },
  { label: "Bitcoin price (USD):", value: "$104,690.00" },
  { label: "Market capitalization (USD):", value: "$2,074,644,020,093.75" },
  { label: "Bitcoins generated per day:", value: "450" },
  { label: "Bitcoins generated per day after the next block halving event:", value: "225" },
  { label: "Bitcoin inflation rate per annum:", value: "0.83%" },
  { label: "Bitcoin inflation rate per annum after the next block halving event:", value: "0.40%" },
  { label: "Bitcoin inflation per day (USD):", value: "$47,110,500" },
  { label: "Bitcoin inflation per day after the next block halving event (USD):", value: "$23,555,250" },
  { label: "Bitcoin inflation until next blockhalf event based on current price (USD):", value: "$55,143,167,406" },
  { label: "Bitcoin block reward (USD):", value: "$327,156.25" },
  { label: "Total blocks:", value: "881,447" },
  { label: "Blocks until mining reward is halved:", value: "168,553" },
  { label: "Total number of block reward halvings:", value: "4" },
  { label: "Approximate block generation time:", value: "10.00 minutes" },
  { label: "Approximate blocks generated per day:", value: "144" },
  { label: "Difficulty:", value: "108,105,433,845,147" },
  { label: "Hash rate:", value: "839.97 Exahashes/s" },
  { label: "Current activated soft forks:", value: "bip34,bip66,bip65,csv,segwit,taproot" },
  { label: "Current pending soft forks:", value: "" },
  { label: "Next retarget period block height:", value: "883008" },
  { label: "Blocks to mine until next difficulty retarget:", value: "1561" },
  { label: "Next difficulty retarget ETA:", value: "10 days, 20 hours, 9 minutes" },
]

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
    <main className="container mx-auto px-4 py-8">
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
            src="/static/picture/bitcoin-inflation-chart.png"
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
            src="/static/picture/tz7lSIL0.png"
            alt="Bitcoin halving chart"
            width={1000}
            height={500}
            className="mx-auto"
          />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4" id="stats">
          Stats
        </h2>
        <StatsTable stats={stats} />
      </section>

      <footer className="text-center py-8">
        <Image src="/static/picture/bitcoin.png" alt="Bitcoin logo" width={100} height={100} className="mx-auto mb-4" />
        <h2>
          <Link href="https://www.litecoinblockhalf.com" className="text-2xl text-blue-600 hover:text-blue-800">
            Litecoin Block Halving Countdown
          </Link>
        </h2>
      </footer>
    </main>
  )
}

