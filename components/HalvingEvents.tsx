import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function HalvingEvents() {
    const { t } = useTranslation();

    const halvingEvents = [
        {
            date: t("halvingEvents.date1"),
            height: "210,000",
            link: "https://www.blockchain.com/explorer/blocks/btc/000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e",
        },
        {
            date: t("halvingEvents.date2"),
            height: "420,000",
            link: "https://www.blockchain.com/explorer/blocks/btc/000000000000000002cce816c0ab2c5c269cb081896b7dcb34b8422d6b74ffa1",
        },
        {
            date: t("halvingEvents.date3"),
            height: "630,000",
            link: "https://www.blockchain.com/explorer/blocks/btc/000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d",
        },
        {
            date: t("halvingEvents.date4"),
            height: "840,000",
            link: "https://www.blockchain.com/explorer/blocks/btc/0000000000000000000320283a032748cef8227873ff4872689bf23f1cda83a5",
        },
    ];

    return (
        <section className="mb-8">

            <ul className="space-y-4">
                {halvingEvents.map((event, index) => (
                    <li key={index} className="bg-blue-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                            {t("halvingEvents.eventDescription", {
                                ordinal: `${index + 1}`, // 明确指定为字符串
                                date: event.date,
                            })}
                        </p>
                        <p className="text-xl font-semibold text-gray-900 break-words">
                            {t("halvingEvents.blockHeight")}{" "}
                            <Link href={event.link} className="text-blue-600 hover:text-blue-800">
                                {event.height}
                            </Link>
                        </p>
                    </li>
                ))}
            </ul>
        </section>
    );
}