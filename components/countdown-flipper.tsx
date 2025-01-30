"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface CountdownProps {
  targetDate: string
  labels: string[]
}

export function CountdownFlipper({ targetDate, labels }: CountdownProps) {
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

  const formatNumber = (num: number) => String(num).padStart(2, "0")

  return (
    <div className="grid grid-cols-4 gap-4 text-center max-w-4xl mx-auto my-8">
      {Object.entries(timeLeft).map(([key, value], index) => (
        <Card key={key} className="p-4 bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md">
          <div className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{formatNumber(value)}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{labels[index]}</div>
        </Card>
      ))}
    </div>
  )
}