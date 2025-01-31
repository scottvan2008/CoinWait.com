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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Mark the component as mounted

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

  // Don't render anything until the component mounts on the client
  if (!isMounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto p-4">
      {Object.entries(timeLeft).map(([key, value], index) => (
        <Card
          key={key}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 transform hover:scale-105"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl md:text-5xl font-bold text-blue-900">
              {formatNumber(value)}
            </div>
            <div className="text-sm md:text-base font-semibold text-blue-600 uppercase tracking-wider">
              {labels[index]}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}