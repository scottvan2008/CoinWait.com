"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function BitcoinBlock() {
    const [blockHeight, setBlockHeight] = useState<number | null>(null);
    const [halvingTime, setHalvingTime] = useState<string | null>(null); // Keep as string
    const [nextHalvingBlock, setNextHalvingBlock] = useState<number | null>(
        null
    );
    const [remainingTime, setRemainingTime] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "bitcoin", "latest");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setBlockHeight(data.height);
                setHalvingTime(data.halvingTime); // Keep as string
                setNextHalvingBlock(data.nextHalvingBlock);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    // Calculate time remaining
    const getRemainingTime = (targetTime: string) => {
        const targetDate = new Date(targetTime).getTime();
        const currentTime = Date.now();
        const remaining = targetDate - currentTime;

        // If the halving has already happened
        if (remaining <= 0) {
            return null;
        }

        // Calculate remaining time in days, hours, minutes, seconds
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
            (remaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    };

    useEffect(() => {
        // Update the remaining time every second
        const interval = setInterval(() => {
            if (halvingTime) {
                const updatedRemainingTime = getRemainingTime(halvingTime);
                setRemainingTime(updatedRemainingTime);
            }
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [halvingTime]); // Only run when halvingTime changes

    return (
        <div className="p-4 bg-gray-800 text-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold">Bitcoin Block Height</h1>
            <p className="text-xl">{blockHeight ?? "Loading..."}</p>
            {halvingTime && nextHalvingBlock && (
                <div className="mt-4">
                    <p className="text-lg">
                        Next Halving at Block #{nextHalvingBlock}
                    </p>
                    {remainingTime ? (
                        <p className="text-lg">
                            Next Halving in:{" "}
                            {remainingTime.days > 0 &&
                                `${remainingTime.days}d `}
                            {remainingTime.hours > 0 &&
                                `${remainingTime.hours}h `}
                            {remainingTime.minutes > 0 &&
                                `${remainingTime.minutes}m `}
                            {remainingTime.seconds > 0 &&
                                `${remainingTime.seconds}s`}
                        </p>
                    ) : (
                        <p className="text-lg">Already happening!</p>
                    )}
                    <p className="mt-2">Halving Time: {halvingTime}</p>
                </div>
            )}
        </div>
    );
}
