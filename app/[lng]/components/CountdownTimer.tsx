"use client"

import { useState, useEffect } from "react";
import { calculateTimeLeft } from "../utils/calculateTimeLeft";

export function CountdownTimer() {
  const targetDate = new Date("2028-04-14T08:59:10Z");
  const initialTimeLeft = calculateTimeLeft(targetDate);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto border border-gray-200">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center leading-tight">
        Bitcoin Block Reward Halving Countdown
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div
            key={unit}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 p-6 border border-blue-200"
          >
            <span className="text-5xl md:text-6xl font-extrabold text-blue-900 drop-shadow-md">
              {value.toString().padStart(2, "0")}
            </span>
            <span className="text-sm md:text-lg font-semibold text-blue-600 uppercase tracking-wider mt-2">
              {unit}
            </span>
          </div>
        ))}
      </div>
      <div className="text-lg text-gray-700 text-center">
        <span className="font-medium">Reward-Drop ETA:</span>
        <strong className="ml-2 text-gray-900">2028-04-14 08:59:10 UTC</strong>
      </div>
    </div>
  );
}
