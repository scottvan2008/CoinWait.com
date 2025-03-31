"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, CalendarIcon, Info, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { db } from "@/lib/firebase"
import { CalendarMonthGrid } from "../bitcoin/calendar-month-grid"
import { EthereumPriceChart } from "./ethereum-price-chart"

interface YearData {
  year: string
  prices: Record<string, number>
  last_updated: string
}

interface PriceData {
  [date: string]: number
}

export function EthereumCalendar() {
  const [allPriceData, setAllPriceData] = useState<PriceData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [availableYears, setAvailableYears] = useState<string[]>([])

  // Get current year and month
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Fetch Ethereum price data from Firestore
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "ethereum_prices"))

        if (querySnapshot.empty) {
          setError("No price data found")
          setLoading(false)
          return
        }

        const priceData: PriceData = {}
        let latestUpdate: string | null = null
        const years: string[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data() as YearData
          years.push(data.year)

          // Add prices to the combined price data
          Object.entries(data.prices).forEach(([date, price]) => {
            priceData[date] = price
          })

          // Track the latest update time
          if (!latestUpdate || new Date(data.last_updated) > new Date(latestUpdate)) {
            latestUpdate = data.last_updated
          }
        })

        setAllPriceData(priceData)
        setLastUpdated(latestUpdate)
        setAvailableYears(years.sort((a, b) => Number.parseInt(b) - Number.parseInt(a))) // Sort years in descending order
        setLoading(false)
      } catch (err) {
        console.error("Error fetching Ethereum price data:", err)
        setError("Failed to fetch Ethereum price data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  // Handle year change
  const handleYearChange = (year: string) => {
    setCurrentDate(new Date(Number.parseInt(year), currentMonth, 1))
  }

  // Handle month change
  const handleMonthChange = (month: string) => {
    setCurrentDate(new Date(currentYear, Number.parseInt(month), 1))
  }

  // Get month name
  const getMonthName = (month: number) => {
    return new Date(0, month).toLocaleString("default", { month: "long" })
  }

  if (loading) {
    return (
      <Card variant="bitcoin" className="w-full mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-64 mb-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
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

  return (
    <Card variant="bitcoin" className="w-full mx-auto overflow-hidden">
      <CardHeader className="pb-1 sm:pb-2 px-2 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <CardTitle className="text-xl text-bitcoin-dark dark:text-white flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-bitcoin" />
            Ethereum Price Calendar
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-1 sm:p-6">
        {/* Calendar Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-6 gap-2 sm:gap-4">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <div className="text-base sm:text-lg font-medium">
              {getMonthName(currentMonth)} {currentYear}
            </div>
            <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-8 w-8 sm:h-10 sm:w-10">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
            <Button
              variant="bitcoin"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="ml-1 sm:ml-2 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10"
            >
              Today
            </Button>
          </div>

          <div className="flex space-x-1 sm:space-x-2 mt-2 sm:mt-0">
            <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[100px] sm:w-[120px] h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {getMonthName(i)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={currentYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[80px] sm:w-[100px] h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Calendar Grid */}
        <CalendarMonthGrid year={currentYear} month={currentMonth} priceData={allPriceData} />

        {/* Price Chart */}
        <div className="mt-6 mb-4">
          <h3 className="text-sm font-medium mb-2 text-bitcoin-dark dark:text-white flex items-center">
            <LineChart className="h-4 w-4 mr-2 text-bitcoin" />
            Ethereum Price Chart - {getMonthName(currentMonth)} {currentYear}
          </h3>
          <EthereumPriceChart year={currentYear} month={currentMonth} priceData={allPriceData} />
        </div>

        <div className="mt-4 sm:mt-6 p-2 sm:p-4 bg-bitcoin-background/50 dark:bg-gray-800/50 rounded-lg text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-bitcoin mt-0.5" />
            <div>
              <p>The calendar displays Ethereum closing prices for each day. Days with price data show:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>The Ethereum closing price in USD (last recorded price of the day in UTC time)</li>
                <li>Price change from the previous day's closing price (green for increase, red for decrease)</li>
                <li>Empty cells indicate no price data is available for that day</li>
              </ul>
              <p className="mt-2 text-xs italic">
                All prices are recorded at 23:59:59 UTC (Coordinated Universal Time), the standard time used in
                cryptocurrency markets.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

