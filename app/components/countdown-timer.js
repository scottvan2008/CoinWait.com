"use client"

import { useEffect, useState } from "react"

export function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const formatNumber = (num) => String(num).padStart(2, "0")

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center space-x-1">
        {formatNumber(timeLeft.days)
          .split("")
          .map((digit, idx) => (
            <div
              key={`days-${idx}`}
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
        <div className="flex items-center text-4xl font-bold text-gray-800 md:text-5xl">:</div>
        {formatNumber(timeLeft.hours)
          .split("")
          .map((digit, idx) => (
            <div
              key={`hours-${idx}`}
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
        <div className="flex items-center text-4xl font-bold text-gray-800 md:text-5xl">:</div>
        {formatNumber(timeLeft.minutes)
          .split("")
          .map((digit, idx) => (
            <div
              key={`minutes-${idx}`}
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
        <div className="flex items-center text-4xl font-bold text-gray-800 md:text-5xl">:</div>
        {formatNumber(timeLeft.seconds)
          .split("")
          .map((digit, idx) => (
            <div
              key={`seconds-${idx}`}
              className="flex h-20 w-16 items-center justify-center rounded bg-gray-800 text-4xl font-bold text-white md:h-24 md:w-20 md:text-5xl"
            >
              {digit}
            </div>
          ))}
      </div>
      <div className="flex justify-center space-x-[4.5rem] text-sm font-medium text-gray-600 md:space-x-24">
        <span>Days</span>
        <span>Hours</span>
        <span>Minutes</span>
        <span>Seconds</span>
      </div>
      <div className="mt-4 text-sm text-gray-500">Reward-Drop ETA date: 14 Apr 2024 16:58:02 UTC</div>
    </div>
  )
}

