"use client"

import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Bitcoin, Calendar } from "lucide-react"
import { db } from "@/lib/firebase"
import type { BlockHeightData, TimeRemaining } from "@/types/bitcoin"
import { formatDate } from "@/lib/formatters"

// Add this function to calculate the halving progress percentage
function calculateHalvingProgress(lastHalvingTime: string, estimatedHalvingTime: string): number {
  const lastHalving = new Date(lastHalvingTime).getTime()
  const nextHalving = new Date(estimatedHalvingTime).getTime()
  const now = new Date().getTime()

  // Calculate the total time between halvings
  const totalTime = nextHalving - lastHalving
  // Calculate the elapsed time since last halving
  const elapsedTime = now - lastHalving

  // Calculate the percentage (capped between 0-100)
  const percentage = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100))

  return Number.parseFloat(percentage.toFixed(2))
}

export function BitcoinHalvingCountdown() {
  const [blockData, setBlockData] = useState<BlockHeightData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch block data from Firestore
  useEffect(() => {
    async function fetchBlockHeight() {
      try {
        const docRef = doc(db, "bitcoin_block_height", "current_height")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setBlockData(docSnap.data() as BlockHeightData)
        } else {
          setError("No data found")
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchBlockHeight()
  }, [])

  // Calculate and update time remaining
  useEffect(() => {
    if (!blockData) return

    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date().getTime()
      const halvingTime = new Date(blockData.estimated_halving_time).getTime()
      const total = halvingTime - now

      // If halving time has passed, return zeros
      if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
      }

      const days = Math.floor(total / (1000 * 60 * 60 * 24))
      const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((total % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds, total }
    }

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining())

    // Update every second
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining()
      setTimeRemaining(remaining)

      if (remaining.total <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [blockData])

  if (loading) {
    return (
      <Card variant="bitcoin" className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="text-red-500 dark:text-red-400">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">Please check your Firestore configuration and try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="mb-12 mt-4">
      <Card variant="bitcoin" className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-2 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bitcoin className="h-10 w-10 text-bitcoin" />
            <CardTitle className="text-2xl md:text-3xl text-bitcoin-dark dark:text-white">
              Bitcoin Halving Countdown
            </CardTitle>
          </div>
          <CardDescription className="text-base dark:text-gray-300">
            Time remaining until the next Bitcoin block reward halving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Larger Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-8 text-center px-1 sm:px-2 md:px-8">
            {[
              { label: "Days", value: timeRemaining?.days },
              { label: "Hours", value: timeRemaining?.hours },
              { label: "Minutes", value: timeRemaining?.minutes },
              { label: "Seconds", value: timeRemaining?.seconds },
            ].map((item, index) => (
              <div key={index} className="flex flex-col">
                <div className="bitcoin-countdown-digit-large h-16 sm:h-20 md:h-24 text-2xl sm:text-3xl md:text-4xl flex items-center justify-center">
                  <span>{item.value?.toString().padStart(2, "0")}</span>
                </div>
                <span className="bitcoin-countdown-label-large text-xs sm:text-sm md:text-base dark:text-gray-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* New Halving Progress Indicator */}
          {blockData && (
            <div className="bg-bitcoin-background dark:bg-gray-800 rounded-lg p-3 sm:p-4 md:p-6 mx-1 sm:mx-2 md:mx-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-bitcoin" />
                  <span className="text-xs sm:text-sm md:text-base font-medium dark:text-gray-300">
                    Halving Progress
                  </span>
                </div>
                <span className="text-xs sm:text-sm md:text-base font-bold text-bitcoin dark:text-blue-400">
                  {calculateHalvingProgress(blockData.last_halving_time, blockData.estimated_halving_time)}%
                </span>
              </div>

              <Progress
                variant="bitcoin"
                value={calculateHalvingProgress(blockData.last_halving_time, blockData.estimated_halving_time)}
                className="h-2 sm:h-3 mb-2 sm:mb-3"
              />

              <div className="flex justify-between text-xs md:text-sm text-muted-foreground mt-1 sm:mt-2">
                <div className="flex flex-col">
                  <span className="text-xs dark:text-gray-400">Last Halving</span>
                  <span className="text-xs sm:text-sm font-medium dark:text-gray-300">
                    {formatDate(blockData.last_halving_time)}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-xs dark:text-gray-400">Estimated Next Halving</span>
                  <span className="text-xs sm:text-sm font-medium dark:text-gray-300">
                    {formatDate(blockData.estimated_halving_time)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

