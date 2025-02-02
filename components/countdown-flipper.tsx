"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

// Function to fetch the current Bitcoin block height
const fetchCurrentBlockHeight = async () => {
  try {
    const response = await fetch("https://blockchain.info/q/getblockcount")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const blockHeight = await response.text()
    return Number.parseInt(blockHeight, 10)
  } catch (error) {
    console.error("Error fetching block height:", error)
    return null
  }
}

// Function to calculate the estimated time until the next halving
const calculateHalvingETA = (currentBlockHeight: number) => {
  const blocksPerHalving = 210000
  const nextHalvingBlock = Math.ceil((currentBlockHeight + 1) / blocksPerHalving) * blocksPerHalving
  const remainingBlocks = nextHalvingBlock - currentBlockHeight
  const averageBlockTimeInMinutes = 10
  const remainingMinutes = remainingBlocks * averageBlockTimeInMinutes
  const currentDate = new Date()
  const etaDate = new Date(currentDate.getTime() + remainingMinutes * 60 * 1000)
  return etaDate
}

export function CountdownFlipper() {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isMounted, setIsMounted] = useState(false)
  const [targetDate, setTargetDate] = useState<Date | null>(null)

  useEffect(() => {
    setIsMounted(true)

    const fetchAndCalculate = async () => {
      const currentBlockHeight = await fetchCurrentBlockHeight()
      if (currentBlockHeight !== null) {
        const etaDate = calculateHalvingETA(currentBlockHeight)
        setTargetDate(etaDate)
      }
    }

    fetchAndCalculate()
  }, [])

  useEffect(() => {
    if (targetDate) {
      const calculateTimeLeft = () => {
        const difference = +targetDate - +new Date()

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
    }
  }, [targetDate])

  const formatNumber = (num: number) => String(num).padStart(2, "0")

  // Function to format date as YYYY-MM-DD HH:mm:ss UTC
const formatDate = (date: Date) => {
    const year = date.getUTCFullYear();
    const month = formatNumber(date.getUTCMonth() + 1);
    const day = formatNumber(date.getUTCDate());
    const hours = formatNumber(date.getUTCHours());
    const minutes = formatNumber(date.getUTCMinutes());
    const seconds = formatNumber(date.getUTCSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
};

  if (!isMounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto p-4">
        {Object.entries(timeLeft).map(([key, value]) => (
          <Card
            key={key}
            className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200 transform hover:scale-105"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-3xl md:text-5xl font-bold text-blue-900">{formatNumber(value)}</div>
              <div className="text-sm md:text-base font-semibold text-blue-600 uppercase tracking-wider">
                {t(`countdown.${key}`)}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-lg mt-6 text-gray-700">
        {t("rewardDropETA")}:{" "}
        <strong className="font-semibold">{targetDate ? formatDate(targetDate) : t("calculating")}</strong>
      </div>
    </div>
  )
}

