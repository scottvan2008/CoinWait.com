"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { formatDate } from "@/lib/formatters"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"

interface YearData {
  year: string
  prices: Record<string, number>
  last_updated: string
}

interface ProcessedData {
  years: string[]
  quarterlyReturns: Record<string, Record<string, number | null>>
  lastUpdated: string | null
}

// Define quarters
const QUARTERS = [
  { name: "Q1", label: "01-03", months: [1, 2, 3] },
  { name: "Q2", label: "04-06", months: [4, 5, 6] },
  { name: "Q3", label: "07-09", months: [7, 8, 9] },
  { name: "Q4", label: "10-12", months: [10, 11, 12] },
]

export function QuarterlyReturnsTable() {
  const [data, setData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [averageReturns, setAverageReturns] = useState<Record<string, number | null>>({})
  const [yearlyReturns, setYearlyReturns] = useState<Record<string, number | null>>({})
  const isMobile = useIsMobile()

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

        // Process the data to calculate quarterly returns
        const processedData = processQuarterlyReturns(yearsData)
        setData({
          years: yearsData.map((y) => y.year),
          quarterlyReturns: processedData.quarterlyReturns,
          lastUpdated: latestUpdate,
        })

        // Calculate average returns for each quarter
        setAverageReturns(calculateAverageReturns(processedData.quarterlyReturns))

        // Calculate yearly returns
        setYearlyReturns(calculateYearlyReturns(yearsData))

        setLoading(false)
      } catch (err) {
        console.error("Error fetching Bitcoin price data:", err)
        setError("Failed to fetch Bitcoin price data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Process the raw data to calculate quarterly returns
  function processQuarterlyReturns(yearsData: YearData[]) {
    const quarterlyReturns: Record<string, Record<string, number | null>> = {}

    yearsData.forEach((yearData) => {
      const { year, prices } = yearData
      quarterlyReturns[year] = {}

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

      // Calculate quarterly returns
      QUARTERS.forEach((quarter) => {
        // Get first available price from first month of the quarter
        const firstMonthWithData = quarter.months.find(
          (month) => monthlyPrices[month] && monthlyPrices[month].length > 0,
        )

        // Get last available price from last month of the quarter
        const lastMonthWithData = [...quarter.months]
          .reverse()
          .find((month) => monthlyPrices[month] && monthlyPrices[month].length > 0)

        // If we don't have data for any month in the quarter, return null
        if (firstMonthWithData === undefined || lastMonthWithData === undefined) {
          quarterlyReturns[year][quarter.name] = null
          return
        }

        const firstPrice = monthlyPrices[firstMonthWithData][0]
        const lastPrice = monthlyPrices[lastMonthWithData][monthlyPrices[lastMonthWithData].length - 1]

        // Calculate percentage change
        const quarterReturn = ((lastPrice - firstPrice) / firstPrice) * 100
        quarterlyReturns[year][quarter.name] = quarterReturn
      })
    })

    return { quarterlyReturns }
  }

  // Calculate average returns for each quarter across all years
  function calculateAverageReturns(quarterlyReturns: Record<string, Record<string, number | null>>) {
    const averages: Record<string, number | null> = {}
    const totals: Record<string, { sum: number; count: number }> = {}

    // Initialize totals
    QUARTERS.forEach((quarter) => {
      totals[quarter.name] = { sum: 0, count: 0 }
    })

    // Sum up returns for each quarter
    Object.values(quarterlyReturns).forEach((yearData) => {
      QUARTERS.forEach((quarter) => {
        const returnValue = yearData[quarter.name]
        if (returnValue !== null) {
          totals[quarter.name].sum += returnValue
          totals[quarter.name].count++
        }
      })
    })

    // Calculate averages
    QUARTERS.forEach((quarter) => {
      const { sum, count } = totals[quarter.name]
      averages[quarter.name] = count > 0 ? sum / count : null
    })

    return averages
  }

  // Calculate yearly returns for each year
  function calculateYearlyReturns(yearsData: YearData[]) {
    const yearlyReturns: Record<string, number | null> = {}

    yearsData.forEach((yearData) => {
      const { year, prices } = yearData

      // If no prices for the year, return null
      if (Object.keys(prices).length === 0) {
        yearlyReturns[year] = null
        return
      }

      // Sort dates to ensure chronological order
      const dates = Object.keys(prices).sort()

      // Get first and last date of the year
      const firstDate = dates[0]
      const lastDate = dates[dates.length - 1]

      // Get first and last price of the year
      const firstPrice = prices[firstDate]
      const lastPrice = prices[lastDate]

      // Calculate percentage change
      const yearReturn = ((lastPrice - firstPrice) / firstPrice) * 100
      yearlyReturns[year] = yearReturn
    })

    return yearlyReturns
  }

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
    <Card variant="bitcoin" className="w-full max-w-xl mx-auto overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Quarterly Returns (%)</CardTitle>
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
                <th
                  className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 sticky left-0 bg-bitcoin-background dark:bg-gray-800 z-10 min-w-[40px]`}
                >
                  Year
                </th>
                {QUARTERS.map((quarter) => (
                  <th
                    key={quarter.name}
                    className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${isMobile ? "min-w-[50px]" : "min-w-[70px]"}`}
                  >
                    {isMobile ? quarter.name : quarter.label}
                  </th>
                ))}
                <th
                  className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 ${isMobile ? "min-w-[40px]" : "min-w-[45px]"}`}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center justify-center w-full">
                        {isMobile ? "Yr" : "Year"}
                        {!isMobile && <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Yearly return</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.years.map((year) => (
                <tr key={year} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td
                    className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center font-medium text-bitcoin-dark dark:text-white border border-gray-200 dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-900 z-10 hover:bg-gray-50 dark:hover:bg-gray-800/50`}
                  >
                    {year}
                  </td>
                  {QUARTERS.map((quarter) => {
                    const returnValue = data.quarterlyReturns[year]?.[quarter.name] ?? null
                    return (
                      <td
                        key={`${year}-${quarter.name}`}
                        className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center border border-gray-200 dark:border-gray-700 ${getBackgroundClass(returnValue)}`}
                      >
                        <div className={`${getReturnClass(returnValue)}`}>{formatPercentage(returnValue)}</div>
                      </td>
                    )
                  })}
                  <td
                    className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center border border-gray-200 dark:border-gray-700 font-medium ${getBackgroundClass(yearlyReturns[year])}`}
                  >
                    <div className={`${getReturnClass(yearlyReturns[year])}`}>
                      {formatPercentage(yearlyReturns[year])}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="bg-bitcoin-background/50 dark:bg-gray-800/50 font-medium">
                <td
                  className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center font-medium text-bitcoin-dark dark:text-white border border-gray-200 dark:border-gray-700 sticky left-0 bg-bitcoin-background/50 dark:bg-gray-800/50 z-10`}
                >
                  {isMobile ? "Avg" : "Average"}
                </td>
                {QUARTERS.map((quarter) => {
                  const avgReturn = averageReturns[quarter.name]
                  return (
                    <td
                      key={`avg-${quarter.name}`}
                      className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center border border-gray-200 dark:border-gray-700 ${getBackgroundClass(avgReturn)}`}
                    >
                      <div className={`${getReturnClass(avgReturn)}`}>{formatPercentage(avgReturn)}</div>
                    </td>
                  )
                })}
                <td
                  className={`${isMobile ? "p-0.5 text-xs" : "p-1"} text-center border border-gray-200 dark:border-gray-700 font-medium`}
                >
                  <div className="text-gray-600 dark:text-gray-400">-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={`${isMobile ? "p-2" : "p-4"} text-sm text-muted-foreground`}>
          <p className="flex items-center">
            <Info className={`${isMobile ? "h-3 w-3 mr-1" : "h-4 w-4 mr-2"} text-bitcoin`} />
            <span className={isMobile ? "text-xs" : ""}>
              Quarterly returns show the percentage change in Bitcoin price from the beginning to the end of each
              quarter.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

