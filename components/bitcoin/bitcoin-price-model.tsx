"use client"

import { useState, useEffect, useMemo } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/firebase"
import { PriceModelTable } from "./price-model-table"
import { PriceModelChart } from "./price-model-chart"
import { formatDate } from "@/lib/formatters"

interface YearData {
  year: string
  prices: Record<string, number>
  last_updated: string
}

interface PriceModelData {
  date: string
  daysSinceBirth: number
  modelPrice: number
  actualPrice?: number
}

// Bitcoin's birthday - Genesis block - defined outside component to avoid recreation
const BITCOIN_BIRTHDAY = new Date("2009-01-03T00:00:00Z")

// Calculate days since Bitcoin's birthday - moved outside component
const calculateDaysSinceBirth = (dateString: string): number => {
  const date = new Date(dateString)
  const diffTime = Math.abs(date.getTime() - BITCOIN_BIRTHDAY.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

// Calculate model price using the formula: 10^(5.84*LOG(Days of birth)-17.01)
// Moved outside component to avoid recreation
const calculateModelPrice = (daysSinceBirth: number): number => {
  return Math.pow(10, 5.84 * Math.log10(daysSinceBirth) - 17.01)
}

export function BitcoinPriceModel() {
  // State initialization
  const [allPriceData, setAllPriceData] = useState<Record<string, Record<string, number>>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Effect for initial data fetch - optimized to only fetch once
  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "bitcoin_prices"))

        if (!isMounted) return

        if (querySnapshot.empty) {
          setError("No price data found")
          setLoading(false)
          return
        }

        const priceDataByYear: Record<string, Record<string, number>> = {}
        let latestUpdate: string | null = null
        const years: string[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data() as YearData
          years.push(data.year)
          priceDataByYear[data.year] = data.prices

          // Track the latest update time
          if (!latestUpdate || new Date(data.last_updated) > new Date(latestUpdate)) {
            latestUpdate = data.last_updated
          }
        })

        // Generate all years from 2011 to current year + 10
        const currentYear = new Date().getFullYear()
        const allYears: string[] = []
        for (let year = 2011; year <= currentYear + 10; year++) {
          allYears.push(year.toString())
        }

        // Sort years in descending order
        const sortedYears = allYears.sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

        // Batch state updates to reduce renders
        setAllPriceData(priceDataByYear)
        setLastUpdated(latestUpdate)
        setAvailableYears(sortedYears)
        setSelectedYear(currentYear.toString())
        setLoading(false)
      } catch (err) {
        console.error("Error fetching Bitcoin price data:", err)
        if (isMounted) {
          setError("Failed to fetch Bitcoin price data")
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array ensures this runs only once

  // Prepare year data - memoize this to prevent unnecessary recalculations
  const yearData = useMemo(() => {
    if (!selectedYear) return []

    // Generate all dates for the selected year
    const allDates: string[] = []
    const startDate = new Date(`${selectedYear}-01-01`)
    const endDate = new Date(`${selectedYear}-12-31`)

    // Create array of all dates in the year
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split("T")[0]
      allDates.push(dateString)
    }

    // Get the price data for the year (if available)
    const yearPrices = allPriceData[selectedYear] || {}

    // Map all dates to data objects - this is now properly memoized
    return allDates.map((date) => {
      const daysSinceBirth = calculateDaysSinceBirth(date)
      const modelPrice = calculateModelPrice(daysSinceBirth)
      const actualPrice = yearPrices[date] // This will be undefined if no data exists

      return {
        date,
        daysSinceBirth,
        modelPrice,
        actualPrice,
      }
    })
  }, [selectedYear, allPriceData])

  // Check if we're viewing a future year - memoized
  const isFutureYear = useMemo(() => {
    if (!selectedYear) return false
    return Number.parseInt(selectedYear) > new Date().getFullYear()
  }, [selectedYear])

  return (
    <Card variant="bitcoin" className="w-full mx-auto overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Bitcoin Price Model</CardTitle>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Select Year:</span>
            {loading ? (
              <Skeleton className="h-10 w-[100px]" />
            ) : (
              <Select value={selectedYear} onValueChange={setSelectedYear} disabled={loading}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => {
                    const yearNum = Number.parseInt(year)
                    const currentYear = new Date().getFullYear()
                    const isFutureYear = yearNum > currentYear

                    return (
                      <SelectItem key={year} value={year}>
                        {year}
                        {isFutureYear ? " (Predicted)" : ""}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-4">
            <Skeleton className="h-96 w-full" />
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 dark:text-red-400">
            <p>{error}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check your Firestore configuration and try again.
            </p>
          </div>
        ) : (
          <div>
            {/* Chart Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium mb-4 text-bitcoin-dark dark:text-white">Price Model Chart</h3>
              <PriceModelChart data={yearData} isFutureYear={isFutureYear} />
            </div>

            {/* Table Section */}
            <div className="p-4">
              <h3 className="text-lg font-medium mb-4 text-bitcoin-dark dark:text-white">Price Model Data</h3>
              <PriceModelTable data={yearData} isFutureYear={isFutureYear} />
            </div>

            <div className="px-4 py-3 bg-bitcoin-background/30 dark:bg-gray-800/30 text-xs text-muted-foreground border-t border-gray-200 dark:border-gray-700">
              <p>
                <strong>About ahr999's model:</strong> This logarithmic growth model suggests that Bitcoin's price
                follows a predictable pattern as the network matures. Positive differences indicate that Bitcoin is
                trading above the model's price (potentially overvalued), while negative differences suggest it may be
                undervalued according to the model. For future years, the model provides price projections based on the
                mathematical formula.
              </p>
              {lastUpdated && <p className="mt-2 text-xs">Last updated: {formatDate(lastUpdated)}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

