import { StatsTable } from "@/components/stats-table";

const stats = [
  { label: "Total Bitcoins in circulation", value: "19,817,022" },
  { label: "Total Bitcoins to ever be produced", value: "21,000,000" },
  { label: "Percentage of total Bitcoins mined", value: "94.37%" },
  { label: "Total Bitcoins left to mine", value: "1,182,978" },
  { label: "Bitcoins left to mine until next blockhalf", value: "526,728" },
  { label: "Bitcoin price (USD)", value: "$104,690.00" },
  { label: "Market capitalization (USD)", value: "$2,074,644,020,093.75" },
  { label: "Bitcoins generated per day", value: "450" },
  { label: "Bitcoins generated per day after next halving", value: "225" },
  { label: "Bitcoin inflation rate per annum", value: "0.83%" },
  { label: "Bitcoin inflation rate after next halving", value: "0.40%" },
  { label: "Bitcoin inflation per day (USD)", value: "$47,110,500" },
  { label: "Bitcoin inflation per day after next halving (USD)", value: "$23,555,250" },
  { label: "Bitcoin inflation until next blockhalf (USD)", value: "$55,143,167,406" },
  { label: "Bitcoin block reward (USD)", value: "$327,156.25" },
  { label: "Total blocks", value: "881,447" },
  { label: "Blocks until mining reward is halved", value: "168,553" },
  { label: "Total number of block reward halvings", value: "4" },
  { label: "Approximate block generation time", value: "10.00 minutes" },
  { label: "Approximate blocks generated per day", value: "144" },
  { label: "Difficulty", value: "108,105,433,845,147" },
  { label: "Hash rate", value: "839.97 Exahashes/s" },
  { label: "Current activated soft forks", value: "bip34,bip66,bip65,csv,segwit,taproot" },
  { label: "Current pending soft forks", value: "" },
  { label: "Next retarget period block height", value: "883008" },
  { label: "Blocks to mine until next difficulty retarget", value: "1561" },
  { label: "Next difficulty retarget ETA", value: "10 days, 20 hours, 9 minutes" },
];

export default function StatsSection() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900" id="stats">
        Bitcoin Stats
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100"
          >
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className="text-xl font-semibold text-gray-900 break-words">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}