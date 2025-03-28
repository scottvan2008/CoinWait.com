"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
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
  // Add a new state for average monthly returns
  const [averageReturns, setAverageReturns] = useState<Record<number, number | null>>({})

  // Update the useEffect to calculate average returns
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

        // Calculate average returns for each month
        setAverageReturns(calculateAverageReturns(processedData.monthlyReturns))

        setLoading(false)
      } catch (err) {
        console.error("Error fetching Bitcoin price data:", err)
        setError("Failed to fetch Bitcoin price data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update the processMonthlyReturns function to use the last day of the previous month
  function processMonthlyReturns(yearsData: YearData[]) {
    const monthlyReturns: Record<string, Record<number, number | null>> = {}

    // Sort years in ascending order to ensure we can access previous year's data
    const sortedYearsData = [...yearsData].sort((a, b) => a.year.localeCompare(b.year))

    sortedYearsData.forEach((yearData, yearIndex) => {
      const { year, prices } = yearData
      monthlyReturns[year] = {}

      // Sort dates to ensure chronological order
      const dates = Object.keys(prices).sort()

      // Group prices by month
      const monthlyPrices: Record<number, { dates: string[]; prices: number[] }> = {}

      dates.forEach((date) => {
        const month = Number.parseInt(date.split("-")[1])
        if (!monthlyPrices[month]) {
          monthlyPrices[month] = { dates: [], prices: [] }
        }
        monthlyPrices[month].dates.push(date)
        monthlyPrices[month].prices.push(prices[date])
      })

      // Calculate monthly returns
      for (let month = 1; month <= 12; month++) {
        if (!monthlyPrices[month] || monthlyPrices[month].dates.length === 0) {
          monthlyReturns[year][month] = null
          continue
        }

        // Get the first date of the current month
        const firstDateOfMonth = monthlyPrices[month].dates[0]

        // Get the last date of the current month
        const lastDateOfMonth = monthlyPrices[month].dates[monthlyPrices[month].dates.length - 1]
        const endPrice = prices[lastDateOfMonth]

        // Find the previous month's last date and price
        let startPrice: number | null = null

        // If this is January, we need to look at the previous year's December
        if (month === 1) {
          if (yearIndex > 0) {
            const prevYearData = sortedYearsData[yearIndex - 1]

            // Check if December data exists in the previous year
            if (prevYearData.prices) {
              const prevYearDates = Object.keys(prevYearData.prices)
                .filter((date) => date.startsWith(`${Number.parseInt(year) - 1}-12`))
                .sort()

              if (prevYearDates.length > 0) {
                // Get the last date from December of the previous year
                const lastDateOfPrevYear = prevYearDates[prevYearDates.length - 1]
                startPrice = prevYearData.prices[lastDateOfPrevYear]
              }
            }
          }
        } else {
          // For other months, find the last date of the previous month in the same year
          const prevMonth = month - 1
          if (monthlyPrices[prevMonth] && monthlyPrices[prevMonth].dates.length > 0) {
            const lastDateOfPrevMonth = monthlyPrices[prevMonth].dates[monthlyPrices[prevMonth].dates.length - 1]
            startPrice = prices[lastDateOfPrevMonth]
          }
        }

        // If we couldn't find a previous month's price, fall back to the first price of the current month
        if (startPrice === null) {
          startPrice = prices[firstDateOfMonth]
        }

        // Calculate percentage change
        const monthReturn = ((endPrice - startPrice) / startPrice) * 100
        monthlyReturns[year][month] = monthReturn
      }
    })

    return { monthlyReturns }
  }

  // Add a function to calculate average returns for each month
  function calculateAverageReturns(monthlyReturns: Record<string, Record<number, number | null>>) {
    const averages: Record<number, number | null> = {}
    const totals: Record<number, { sum: number; count: number }> = {}

    // Initialize totals for each month
    for (let month = 1; month <= 12; month++) {
      totals[month] = { sum: 0, count: 0 }
    }

    // Sum up returns for each month
    Object.values(monthlyReturns).forEach((yearData) => {
      for (let month = 1; month <= 12; month++) {
        const returnValue = yearData[month]
        if (returnValue !== null) {
          totals[month].sum += returnValue
          totals[month].count++
        }
      }
    })

    // Calculate averages
    for (let month = 1; month <= 12; month++) {
      const { sum, count } = totals[month]
      averages[month] = count > 0 ? sum / count : null
    }

    return averages
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

  // Update the table to include the Average row
  return (
    <Card variant="bitcoin" className="w-full mx-auto overflow-hidden">
      <CardHeader className="py-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Monthly Returns (%)</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-bitcoin-background dark:bg-gray-800">
                <th className="p-2 text-center font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 sticky left-0 bg-bitcoin-background dark:bg-gray-800 z-1">
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
                  <td className="p-2 text-center font-medium text-bitcoin-dark dark:text-white border border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-1 hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
              {/* Add Average row */}
              <tr className="bg-bitcoin-background/50 dark:bg-gray-800/50 font-medium">
                <td className="p-2 text-center font-medium text-bitcoin-dark dark:text-white border border-gray-200 dark:border-gray-700 sticky left-0 bg-bitcoin-background/50 dark:bg-gray-800/50 z-1">
                  Average
                </td>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                  const avgReturn = averageReturns[month]
                  return (
                    <td
                      key={`avg-${month}`}
                      className={`p-2 text-center border border-gray-200 dark:border-gray-700 ${getBackgroundClass(avgReturn)}`}
                    >
                      <div className={`${getReturnClass(avgReturn)}`}>{formatPercentage(avgReturn)}</div>
                    </td>
                  )
                })}
              </tr>
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

