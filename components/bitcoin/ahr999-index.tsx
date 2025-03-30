"use client"

import { useState, useEffect, useMemo } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import { AHR999Chart } from "./ahr999-chart"
import { AHR999Table } from "./ahr999-table"
import { AHR999Explanation } from "./ahr999-explanation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DailyIndex {
  ahr999: number
  daily_close: number
  avg_200_day_cost: number
}

interface YearData {
  year: string
  daily_indices: Record<string, DailyIndex>
  last_updated: string
}

interface ChartDataPoint {
  date: string
  ahr999: number
  daily_close: number
  avg_200_day_cost: number
}

export function AHR999Index() {
  const [indexData, setIndexData] = useState<Record<string, YearData>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeFrame, setTimeFrame] = useState<string>("1y")
  // Add a new state for selected year
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString())

  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  // Fetch data from Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "ahr999_index"))

        if (querySnapshot.empty) {
          setError("No AHR999 index data found")
          setLoading(false)
          return
        }

        const data: Record<string, YearData> = {}
        let latestUpdate: string | null = null

        querySnapshot.forEach((doc) => {
          const yearData = doc.data() as YearData
          data[yearData.year] = yearData

          // Track the latest update time
          if (!latestUpdate || new Date(yearData.last_updated) > new Date(latestUpdate)) {
            latestUpdate = yearData.last_updated
          }
        })

        setIndexData(data)
        setLastUpdated(latestUpdate)

        const currentYear = new Date().getFullYear().toString()
        if (data[currentYear]) {
          setSelectedYear(currentYear)
        } else {
          // If current year data isn't available, use the most recent year
          const availableYears = Object.keys(data).sort((a, b) => b.localeCompare(a))
          if (availableYears.length > 0) {
            setSelectedYear(availableYears[0])
          } else {
            setSelectedYear("all")
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching AHR999 index data:", err)
        setError("Failed to fetch AHR999 index data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Modify the chartData useMemo to filter only by selectedYear
  const chartData = useMemo(() => {
    if (Object.keys(indexData).length === 0) return []

    const allData: ChartDataPoint[] = []

    // Combine all data from all years or just the selected year
    Object.entries(indexData).forEach(([year, yearData]) => {
      // Skip if a specific year is selected and this isn't it
      if (selectedYear !== "all" && year !== selectedYear) return

      Object.entries(yearData.daily_indices).forEach(([date, indices]) => {
        allData.push({
          date,
          ahr999: indices.ahr999,
          daily_close: indices.daily_close,
          avg_200_day_cost: indices.avg_200_day_cost,
        })
      })
    })

    // Sort by date
    return allData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [indexData, selectedYear])

  // Add a function to get available years from the data
  const availableYears = useMemo(() => {
    const years = Object.keys(indexData).sort((a, b) => b.localeCompare(a)) // Sort in descending order
    return ["all", ...years]
  }, [indexData])

  // Get the latest AHR999 value
  const latestValue = useMemo(() => {
    if (chartData.length === 0) return null
    return chartData[chartData.length - 1]
  }, [chartData])

  // Determine the market phase based on AHR999 value
  const getMarketPhase = (value: number): { phase: string; color: string } => {
    if (value >= 4) return { phase: "Extreme Overvaluation", color: "text-red-600 dark:text-red-400" }
    if (value >= 1.2) return { phase: "Bull Market", color: "text-green-600 dark:text-green-400" }
    if (value >= 0.45) return { phase: "DCA Zone", color: "text-blue-600 dark:text-blue-400" }
    return { phase: "Bottom Fishing", color: "text-amber-600 dark:text-amber-400" }
  }

  if (loading) {
    return (
      <Card variant="bitcoin" className="w-full mx-auto">
        <CardHeader>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full mx-auto border-red-200 dark:border-red-900">
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

  const marketPhase = latestValue ? getMarketPhase(latestValue.ahr999) : { phase: "Unknown", color: "text-gray-500" }

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      {latestValue && (
        <Card className="w-full border-bitcoin/20 dark:border-bitcoin/10 shadow-sm" variant="bitcoin">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-bitcoin-background/70 dark:bg-gray-800/70 rounded-lg">
                  <div className="text-xs text-muted-foreground">AHR999 Index</div>
                  <div className="text-xl font-bold text-bitcoin-dark dark:text-white flex items-center gap-1">
                    {latestValue.ahr999.toFixed(2)}
                    <span className={`text-xs font-medium ${marketPhase.color}`}>({marketPhase.phase})</span>
                  </div>
                </div>

                <div className="p-2 bg-bitcoin-background/70 dark:bg-gray-800/70 rounded-lg">
                  <div className="text-xs text-muted-foreground">Current Price</div>
                  <div className="text-xl font-bold text-bitcoin-dark dark:text-white">
                    {formatCurrency(latestValue.daily_close)}
                  </div>
                </div>

                <div className="p-2 bg-bitcoin-background/70 dark:bg-gray-800/70 rounded-lg">
                  <div className="text-xs text-muted-foreground">200-Day Avg</div>
                  <div className="text-xl font-bold text-bitcoin-dark dark:text-white">
                    {formatCurrency(latestValue.avg_200_day_cost)}
                  </div>
                </div>
              </div>

              <div className="text-xs text-muted-foreground whitespace-nowrap">
                As of {formatDateOnly(latestValue.date)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart and Data Tabs */}
      <Card className="w-full border-bitcoin/20 dark:border-bitcoin/10 shadow-md" variant="bitcoin">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-xl text-bitcoin-dark dark:text-white">AHR999 Index Chart</CardTitle>

            <div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "All Years" : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        {/* Add a small padding on the left for mobile */}
        <CardContent className="px-2 py-0 sm:p-6">
          <AHR999Chart data={chartData} selectedYear={selectedYear} />
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="w-full border-bitcoin/20 dark:border-bitcoin/10 shadow-md" variant="bitcoin">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Historical Data</CardTitle>
        </CardHeader>
        <CardContent>
          <AHR999Table data={chartData} selectedYear={selectedYear} />
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <AHR999Explanation />
    </div>
  )
}

