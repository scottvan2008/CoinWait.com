import Link from "next/link";

export default function HalvingEvents() {
  return (
    <ul className="space-y-4">
      {/* First Halving Event */}
      <li className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100">
        <p className="text-sm font-medium text-gray-600 mb-1">
          The first halving event occurred on the 28th of November, 2012 (UTC)
        </p>
        <p className="text-xl font-semibold text-gray-900 break-words">
          Block Height{" "}
          <Link
            href="https://www.blockchain.com/explorer/blocks/btc/000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e"
            className="text-blue-600 hover:text-blue-800"
          >
            210,000
          </Link>
        </p>
      </li>

      {/* Second Halving Event */}
      <li className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100">
        <p className="text-sm font-medium text-gray-600 mb-1">
          The second halving event occurred on the 9th of July, 2016 (UTC)
        </p>
        <p className="text-xl font-semibold text-gray-900 break-words">
          Block Height{" "}
          <Link
            href="https://www.blockchain.com/explorer/blocks/btc/000000000000000002cce816c0ab2c5c269cb081896b7dcb34b8422d6b74ffa1"
            className="text-blue-600 hover:text-blue-800"
          >
            420,000
          </Link>
        </p>
      </li>

      {/* Third Halving Event */}
      <li className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100">
        <p className="text-sm font-medium text-gray-600 mb-1">
          The third halving event occurred on the 11th of May, 2020 (UTC)
        </p>
        <p className="text-xl font-semibold text-gray-900 break-words">
          Block Height{" "}
          <Link
            href="https://www.blockchain.com/explorer/blocks/btc/000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d"
            className="text-blue-600 hover:text-blue-800"
          >
            630,000
          </Link>
        </p>
      </li>

      {/* Fourth Halving Event */}
      <li className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100">
        <p className="text-sm font-medium text-gray-600 mb-1">
          The fourth halving event occurred on the 20th of April, 2024 (UTC)
        </p>
        <p className="text-xl font-semibold text-gray-900 break-words">
          Block Height{" "}
          <Link
            href="https://www.blockchain.com/explorer/blocks/btc/0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5"
            className="text-blue-600 hover:text-blue-800"
          >
            840,000
          </Link>
        </p>
      </li>
    </ul>
  );
}