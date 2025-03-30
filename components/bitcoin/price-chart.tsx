"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { formatCurrency } from "@/lib/formatters"
import { useIsMobile } from "@/hooks/use-mobile"

interface PriceChartProps {
  year: number
  month: number
  priceData: Record<string, number>
}

export function PriceChart({ year, month, priceData }: PriceChartProps) {
  const [chartData, setChartData] = useState<Array<{ date: string; day: number; price: number | null }>>([])
  const [averagePrice, setAveragePrice] = useState<number | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    // Generate all dates for the selected month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const data = []
    let totalPrice = 0
    let priceCount = 0

    for (let day = 1; day <= daysInMonth; day++) {
      // Format the date string to match the Firestore format (YYYY-MM-DD)
      const formattedMonth = (month + 1).toString().padStart(2, "0")
      const formattedDay = day.toString().padStart(2, "0")
      const dateString = `${year}-${formattedMonth}-${formattedDay}`

      // Get the price for the current day
      const price = priceData[dateString] || null

      if (price !== null) {
        totalPrice += price
        priceCount++
      }

      data.push({
        date: dateString,
        day,
        price,
      })
    }

    setChartData(data)
    setAveragePrice(priceCount > 0 ? totalPrice / priceCount : null)
  }, [year, month, priceData])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-lg font-bold text-bitcoin dark:text-blue-400">
            {payload[0].value !== null ? formatCurrency(payload[0].value) : "No data"}
          </p>
        </div>
      )
    }
    return null
  }

  // Format X-axis ticks
  const formatXAxis = (day: number) => {
    // Only show every 5th day on mobile, every 3rd day on desktop
    if (isMobile) {
      return day % 5 === 0 ? day : ""
    }
    return day % 3 === 0 ? day : ""
  }

  // Check if we have any price data
  const hasData = chartData.some((item) => item.price !== null)

  if (!hasData) {
    return (
      <div className="h-[200px] sm:h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-muted-foreground text-sm">No price data available for this month</p>
      </div>
    )
  }

  return (
    <div className="h-[200px] sm:h-[300px] w-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-2 sm:p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis dataKey="day" tickFormatter={formatXAxis} tick={{ fontSize: 12 }} tickMargin={8} />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, 0)}
            width={60}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            domain={["auto", "auto"]}
          />
          <Tooltip content={<CustomTooltip />} />
          {averagePrice && (
            <ReferenceLine
              y={averagePrice}
              stroke="#3B82F6"
              strokeDasharray="3 3"
              label={{
                value: "Avg",
                position: "insideTopRight",
                fill: "#3B82F6",
                fontSize: 12,
                offset: 10,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 3, fill: "#3B82F6", stroke: "#fff", strokeWidth: 1 }}
            activeDot={{ r: 6, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

