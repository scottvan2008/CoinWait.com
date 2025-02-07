import Image from "next/image";
import Link from "next/link";

export function InfoSection() {
  return (
    <section className="prose mb-12 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a block halving event?</h2>
      <p className="text-gray-700">
        As part of Bitcoin&apos;s coin issuance, miners are rewarded a certain amount of bitcoins whenever a block is
        produced (approximately every 10 minutes). When Bitcoin first started, 50 Bitcoins per block were given as a
        reward to miners. After every 210,000 blocks are mined (approximately every 4 years), the block reward halves
        and will keep on halving until the block reward per block becomes 0 (approximately by year 2140). As of now, the
        block reward is 3.125 coins per block and will decrease to 1.5625 coins per block post halving.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why was this done?</h2>
      <p className="text-gray-700">
        Bitcoin was designed as a deflationary currency. Like gold, the premise is that over time, the issuance of
        bitcoins will decrease and thus become scarcer over time. As bitcoins become scarcer and if demand for them
        increases over time, Bitcoin can be used as a hedge against inflation as the price, guided by price equilibrium
        is bound to increase. On the flip side, fiat currencies (like the US dollar), inflate over time as its monetary
        supply increases, leading to a decrease in purchasing power. This is known as monetary debasement by inflation.
        A simple example would be to compare housing prices decades ago to now and you&apos;ll notice that they&apos;ve increased
        over time!
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Predictable monetary supply</h2>
      <p className="text-gray-700">
        Since we know Bitcoin&apos;s issuance over time, people can rely on programmed/controlled supply. This is helpful to
        understand what the current inflation rate of Bitcoin is, what the future inflation rate will be at a specific
        point in time, how many Bitcoins are in circulation and how many remain left to be mined.
      </p>

      <div className="my-8">
        <Image
          src="/bitcoin-inflation-chart.png"
          alt="Bitcoin Inflation Chart"
          width={800}
          height={400}
          className="mx-auto rounded-lg shadow-lg"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Who controls the issuance of Bitcoin?</h2>
      <p className="text-gray-700">
        The network itself controls the issuance of Bitcoins, derived by consensus through all Bitcoin participants.
        Ever since Bitcoin was first designed, the following consensus rules have existed: a maximum of 21,000,000
        Bitcoins will ever be produced, a target of 10-minute block intervals, a halving event occurring every 210,000
        blocks (approximately every four years), and a block reward starting at 50 and halving continually at each
        halving event until it reaches 0 (approximately by the year 2140). Any change to these parameters requires all
        Bitcoin participants to agree by consensus to approve the change.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Past halving event dates</h2>
      <ul className="space-y-4">
        {[
          {
            date: "28th of November, 2012",
            height: "210,000",
            link: "000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e",
          },
          {
            date: "9th of July, 2016",
            height: "420,000",
            link: "000000000000000002cce816c0ab2c5c269cb081896b7dcb34b8422d6b74ffa1",
          },
          {
            date: "11th of May, 2020",
            height: "630,000",
            link: "000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d",
          },
          {
            date: "20th of April, 2024",
            height: "840,000",
            link: "0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
          },
        ].map((event, index) => (
          <li
            key={index}
            className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100"
          >
            <p className="text-sm font-medium text-gray-600 mb-1">
              The {index === 0 ? "first" : index === 1 ? "second" : index === 2 ? "third" : "fourth"} halving event
              occurred on the {event.date} (UTC)
            </p>
            <p className="text-xl font-semibold text-gray-900 break-words">
              Block Height{" "}
              <Link
                href={`https://www.blockchain.com/explorer/blocks/btc/${event.link}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {event.height}
              </Link>
            </p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Past halving price performance</h2>
      <p className="text-gray-700">
        It is always a debate on what Bitcoin will do in terms of pricing for a halving event. Some people believe that
        the halving is already priced in by the market and thus there&apos;s no expectation for the price to do anything.
        Others believe that due to price equilibrium, a halving of supply should cause an increase in price if demand
        for Bitcoins is equal or greater than what it was before the halving event. Below is a chart showing past price
        performance of the last four halving events:
      </p>

      <div className="my-8">
        <Image
          src="/tz7lSIL0.png"
          alt="Bitcoin Halving Chart"
          width={1000}
          height={500}
          className="mx-auto rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}