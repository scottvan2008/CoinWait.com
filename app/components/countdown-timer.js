"use client"; // Indicates this is a client-side component (used in frameworks like Next.js)

import { useEffect, useState } from "react"; // Import React hooks

export function CountdownTimer({ targetDate }) {
  // State to store the time left until the target date
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // useEffect hook to calculate and update the time left every second
  useEffect(() => {
    const calculateTimeLeft = () => {
      // Calculate the difference between the target date and the current date
      const difference = +new Date(targetDate) - +new Date();

      // If the target date is in the future, update the time left
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)), // Calculate days
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24), // Calculate hours
          minutes: Math.floor((difference / 1000 / 60) % 60), // Calculate minutes
          seconds: Math.floor((difference / 1000) % 60), // Calculate seconds
        });
      } else {
        // If the countdown is over, set all values to 0
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    // Calculate the time left immediately when the component mounts
    calculateTimeLeft();

    // Set up an interval to update the time left every second
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, [targetDate]); // Re-run the effect if the targetDate changes

  // Helper function to format numbers with leading zeros (e.g., 5 -> "05")
  const formatNumber = (num) => String(num).padStart(2, "0");

  return (
    <div className="text-center">
      {/* Display the countdown timer */}
      <div className="mb-4 flex justify-center space-x-1">
        {/* Days */}
        {formatNumber(timeLeft.days)
          .split("")
          .map((digit, idx) => (
            <div
              key={`days-${idx}`} // Unique key for each digit
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
        <div className="flex items-center text-4xl font-bold text-gray-800 md:text-5xl">:</div>

        {/* Hours */}
        {formatNumber(timeLeft.hours)
          .split("")
          .map((digit, idx) => (
            <div
              key={`hours-${idx}`} // Unique key for each digit
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
        <div className="flex items-center text-4xl font-bold text-gray-800 md:text-5xl">:</div>

        {/* Minutes */}
        {formatNumber(timeLeft.minutes)
          .split("")
          .map((digit, idx) => (
            <div
              key={`minutes-${idx}`} // Unique key for each digit
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
        <div className="flex items-center text-4xl font-bold text-gray-800 md:text-5xl">:</div>

        {/* Seconds */}
        {formatNumber(timeLeft.seconds)
          .split("")
          .map((digit, idx) => (
            <div
              key={`seconds-${idx}`} // Unique key for each digit
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
      </div>

      {/* Labels for days, hours, minutes, and seconds */}
      <div className="flex justify-center space-x-[4.5rem] text-sm font-medium text-gray-600 md:space-x-24">
        <span>Days</span>
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>

      {/* Display the target date */}
      <div className="mt-4 text-sm text-gray-500">
        Reward-Drop ETA date: 14 Apr 2028 17:20:18 UTC
      </div>
    </div>
  );
}