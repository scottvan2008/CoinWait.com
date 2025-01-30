"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface CountdownProps {
  targetDate: string;
  labels: string[];
}

export function CountdownFlipper({ targetDate, labels }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="grid grid-cols-4 gap-4 text-center max-w-4xl mx-auto my-8">
      {Object.entries(timeLeft).map(([key, value], index) => (
        <Card
          key={key}
          className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 text-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
        >
          <div className="text-4xl font-bold mb-2 text-gray-900">
            {formatNumber(value)}
          </div>
          <div className="text-sm font-medium text-gray-600">
            {labels[index]}
          </div>
        </Card>
      ))}
    </div>
  );
}