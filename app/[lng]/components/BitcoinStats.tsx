export function BitcoinStats() {
    const stats = [
      { label: "Total Bitcoins in circulation", value: "19,820,290.625" },
      { label: "Total Bitcoins to ever be produced", value: "21,000,000" },
      { label: "Percentage of total Bitcoins mined", value: "94.38%" },
      { label: "Total Bitcoins left to mine", value: "1,179,709.375" },
      { label: "Bitcoins left to mine until next blockhalf", value: "523,459.38" },
      { label: "Bitcoin price (USD)", value: "$97,139" },
      { label: "Market capitalization (USD)", value: "$1,925,323,211,021.88" },
      { label: "Bitcoins generated per day", value: "450" },
      { label: "Bitcoins generated per day after next halving", value: "225" },
      { label: "Bitcoin inflation rate per annum", value: "0.83%" },
      { label: "Bitcoin inflation rate after next halving", value: "0.40%" },
      { label: "Bitcoin inflation per day (USD)", value: "$43,712,550" },
      { label: "Bitcoin inflation per day after next halving (USD)", value: "$21,856,275" },
      { label: "Bitcoin inflation until next blockhalf (USD)", value: "$50,848,320,228.13" },
      { label: "Bitcoin block reward (USD)", value: "$303,559.38" },
      { label: "Total blocks", value: "882,493" },
      { label: "Blocks until mining reward is halved", value: "167,507" },
      { label: "Total number of block reward halvings", value: "4" },
      { label: "Approximate block generation time", value: "10 minutes" },
      { label: "Approximate blocks generated per day", value: "144" },
      { label: "Difficulty", value: "108,105,433,845,147" },
      { label: "Hash rate", value: "789.97 EH/s" },
      { label: "Current activated soft forks", value: "bip34,bip66,bip65,csv,segwit,taproot" },
      { label: "Current pending soft forks", value: "Loading..." },
      { label: "Next retarget period block height", value: "883008" },
      { label: "Blocks to mine until next difficulty retarget", value: "515" },
      { label: "Next difficulty retarget ETA", value: "2025-02-09 07:21:00 UTC" },
    ]
  
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
              <p className="text-xl font-semibold text-gray-900 break-words">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  
  