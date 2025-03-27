"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { formatDate } from "@/lib/formatters"
import { Info } from "lucide-react"

interface YearData {
  year: string
  prices: Record<string, number>
  last_updated: string
}

interface MonthlyReturn {
  year: string
  month: number
  return: number | null
}

interface ProcessedData {
  years: string[]
  monthlyReturns: Record<string, Record<number, number | null>>
  lastUpdated: string | null
}

// Updated months to display as "01", "02", etc.
const MONTHS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

export function MonthlyReturnsTable() {
  const [data, setData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [
    /* Remove the yearlyReturns state: */
  ] = useState<Record<string, number | null>>({})

  // Update the useEffect to pass yearsData to calculateYearlyReturns
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const querySnapshot = await getDocs(collection(db, "bitcoin_prices"))

        if (querySnapshot.empty) {
          setError("No data found")
          setLoading(false)
          return
        }

        const yearsData: YearData[] = []
        let latestUpdate: string | null = null

        querySnapshot.forEach((doc) => {
          const data = doc.data() as YearData
          yearsData.push(data)

          // Track the latest update time
          if (!latestUpdate || new Date(data.last_updated) > new Date(latestUpdate)) {
            latestUpdate = data.last_updated
          }
        })

        // Sort years in descending order
        yearsData.sort((a, b) => b.year.localeCompare(a.year))

        // Process the data to calculate monthly returns
        const processedData = processMonthlyReturns(yearsData)
        setData({
          years: yearsData.map((y) => y.year),
          monthlyReturns: processedData.monthlyReturns,
          lastUpdated: latestUpdate,
        })

        // Calculate yearly returns using the raw price data
        /* Remove the setYearlyReturns call in the useEffect: */
        setLoading(false)
      } catch (err) {
        console.error("Error fetching Bitcoin price data:", err)
        setError("Failed to fetch Bitcoin price data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process the raw data to calculate monthly returns
  function processMonthlyReturns(yearsData: YearData[]) {
    const monthlyReturns: Record<string, Record<number, number | null>> = {}

    yearsData.forEach((yearData) => {
      const { year, prices } = yearData
      monthlyReturns[year] = {}

      // Sort dates to ensure chronological order
      const dates = Object.keys(prices).sort()

      // Group prices by month
      const monthlyPrices: Record<number, number[]> = {}

      dates.forEach((date) => {
        const month = Number.parseInt(date.split("-")[1])
        if (!monthlyPrices[month]) {
          monthlyPrices[month] = []
        }
        monthlyPrices[month].push(prices[date])
      })

      // Calculate monthly returns
      for (let month = 1; month <= 12; month++) {
        if (!monthlyPrices[month] || monthlyPrices[month].length === 0) {
          monthlyReturns[year][month] = null
          continue
        }

        // Get first and last price of the month
        const pricesInMonth = monthlyPrices[month]
        const firstPrice = pricesInMonth[0]
        const lastPrice = pricesInMonth[pricesInMonth.length - 1]

        // Calculate percentage change
        const monthReturn = ((lastPrice - firstPrice) / firstPrice) * 100
        monthlyReturns[year][month] = monthReturn
      }
    })

    return { monthlyReturns }
  }

  // Update the calculateYearlyReturns function to use first and last day prices
  /* Remove the calculateYearlyReturns function: */

  // Format percentage for display
  function formatPercentage(value: number | null) {
    if (value === null) return "-"
    return `${value > 0 ? "+" : ""}${value.toFixed(0)}%`
  }

  // Get CSS class based on return value
  function getReturnClass(value: number | null) {
    if (value === null) return "text-gray-400"
    if (value > 0) return "text-green-600 dark:text-green-400 font-medium"
    if (value < 0) return "text-red-600 dark:text-red-400 font-medium"
    return "text-gray-600 dark:text-gray-400"
  }

  // Get background class based on return value for better visualization
  function getBackgroundClass(value: number | null) {
    if (value === null) return ""
    if (value > 20) return "bg-green-100 dark:bg-green-900/20"
    if (value > 10) return "bg-green-50 dark:bg-green-900/10"
    if (value > 0) return "bg-green-50/50 dark:bg-green-900/5"
    if (value < -20) return "bg-red-100 dark:bg-red-900/20"
    if (value < -10) return "bg-red-50 dark:bg-red-900/10"
    if (value < 0) return "bg-red-50/50 dark:bg-red-900/5"
    return ""
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
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Monthly Returns (%)</CardTitle>
          {data?.lastUpdated && (
            <div className="text-xs text-muted-foreground">Last updated: {formatDate(data.lastUpdated)}</div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-bitcoin-background dark:bg-gray-800">
                <th className="p-2 text-center font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 sticky left-0 bg-bitcoin-background dark:bg-gray-800 z-10">
                  Year
                </th>
                {MONTHS.map((month, index) => (
                  <th
                    key={month}
                    className="p-2 text-center font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 min-w-[50px]"
                  >
                    {month}
                  </th>
                ))}
                {/* Remove the yearly return column from the table header */}
              </tr>
            </thead>
            <tbody>
              {data?.years.map((year) => (
                <tr key={year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-2 text-center font-medium text-bitcoin-dark dark:text-white border border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-10 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {year}
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                    const returnValue = data.monthlyReturns[year]?.[month] ?? null
                    return (
                      <td
                        key={`${year}-${month}`}
                        className={`p-2 text-center border border-gray-200 dark:border-gray-700 ${getBackgroundClass(returnValue)}`}
                      >
                        <div className={`${getReturnClass(returnValue)}`}>{formatPercentage(returnValue)}</div>
                      </td>
                    )
                  })}
                  {/* Remove the yearly return data from each row */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-sm text-muted-foreground">
          <p className="flex items-center">
            <Info className="h-4 w-4 mr-2 text-bitcoin" />
            Monthly returns show the percentage change in Bitcoin price from the beginning to the end of each month.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

