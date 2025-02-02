import Link from "next/link"
import { useTranslation } from "react-i18next"

export default function HalvingEvents() {
  const { t } = useTranslation()

  const halvingEvents = [
    {
      id: "first",
      date: t("halvingEvents.first.date"),
      blockHeight: "210,000",
      blockLink:
        "https://www.blockchain.com/explorer/blocks/btc/000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e",
    },
    {
      id: "second",
      date: t("halvingEvents.second.date"),
      blockHeight: "420,000",
      blockLink:
        "https://www.blockchain.com/explorer/blocks/btc/000000000000000002cce816c0ab2c5c269cb081896b7dcb34b8422d6b74ffa1",
    },
    {
      id: "third",
      date: t("halvingEvents.third.date"),
      blockHeight: "630,000",
      blockLink:
        "https://www.blockchain.com/explorer/blocks/btc/000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d",
    },
    {
      id: "fourth",
      date: t("halvingEvents.fourth.date"),
      blockHeight: "840,000",
      blockLink:
        "https://www.blockchain.com/explorer/blocks/btc/0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
    },
  ]

  return (
    <ul className="space-y-4">
      {halvingEvents.map((event) => (
        <li
          key={event.id}
          className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100"
        >
          <p className="text-sm font-medium text-gray-600 mb-1">
            {t(`halvingEvents.${event.id}.description`, { date: event.date })}
          </p>
          <p className="text-xl font-semibold text-gray-900 break-words">
            {t("blockHeight")}{" "}
            <Link href={event.blockLink} className="text-blue-600 hover:text-blue-800">
              {event.blockHeight}
            </Link>
          </p>
        </li>
      ))}
    </ul>
  )
}

