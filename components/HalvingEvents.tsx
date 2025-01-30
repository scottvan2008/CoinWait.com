// components/HalvingEvents.tsx
import Link from "next/link";

// Define the type for a halving event
interface HalvingEvent {
  date: string;
  height: string;
  link: string;
}

// Define the props for the HalvingEvents component (if needed)
interface HalvingEventsProps {
  // You can add props here if you want to pass data dynamically
}

const halvingEvents: HalvingEvent[] = [
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
];

export default function HalvingEvents({}: HalvingEventsProps) {
  return (
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
  );
}