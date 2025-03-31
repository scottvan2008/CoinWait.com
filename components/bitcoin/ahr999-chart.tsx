"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import { useIsMobile } from "@/hooks/use-mobile"

interface ChartDataPoint {
  date: string
  ahr999: number
  daily_close: number
  avg_200_day_cost: number
}

interface AHR999ChartProps {
  data: ChartDataPoint[]
  selectedYear?: string
}

export function AHR999Chart({ data, selectedYear = "all" }: AHR999ChartProps) {
  const isMobile = useIsMobile()

  // Format date for display
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Custom price formatter for Y-axis
  const formatYAxisPrice = (value: number) => {
    if (isMobile) {
      // Format as xxk on mobile
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}k`
      }
    }
    return formatCurrency(value, 0)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label)
      const formattedDate = formatDateOnly(label)

      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{formattedDate}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="font-medium">AHR999:</span> {payload[0].value.toFixed(2)}
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              <span className="font-medium">Price:</span> {formatCurrency(payload[1].value)}
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              <span className="font-medium">200d Avg:</span> {formatCurrency(payload[2].value)}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  // Calculate domain for price axis with less padding
  const priceDomain = useMemo(() => {
    if (data.length === 0) return [0, 100000]

    const prices = data.map((d) => d.daily_close)
    const avgPrices = data.map((d) => d.avg_200_day_cost)
    const allPrices = [...prices, ...avgPrices]

    // Use 5% padding instead of 20% to keep the chart closer to actual data range
    const min = Math.min(...allPrices) * 0.95
    const max = Math.max(...allPrices) * 1.05

    return [min, max]
  }, [data])

  // Calculate days in each zone
  const zoneStats = useMemo(() => {
    if (data.length === 0) return { bullMarket: 0, dcaZone: 0, bottomFishing: 0 }

    let bullMarket = 0
    let dcaZone = 0
    let bottomFishing = 0

    data.forEach((point) => {
      if (point.ahr999 > 1.2) bullMarket++
      else if (point.ahr999 >= 0.45) dcaZone++
      else bottomFishing++
    })

    return { bullMarket, dcaZone, bottomFishing }
  }, [data])

  // Calculate maximum AHR999 value for Y-axis scaling
  const calculateMaxAhr999Value = () => {
    if (data.length === 0) return 3

    const maxValue = Math.max(...data.map((item) => item.ahr999))
    // Add 20% padding above the maximum value
    const paddedMax = Math.ceil(maxValue * 1.2)
    // Ensure we always show at least up to 3 for context
    return Math.max(3, paddedMax)
  }

  // Generate dynamic ticks for AHR999 axis
  const generateAhr999Ticks = (maxValue: number) => {
    // Always include 0, 1, 2, 3 as reference points
    const baseTicks = [0, 1, 2, 3]

    // If max value is 3 or less, just return the base ticks
    if (maxValue <= 3) return baseTicks

    // For values above 3, add additional ticks
    const additionalTicks = []
    const tickStep = maxValue > 10 ? 2 : 1 // Use larger steps for very high values

    for (let i = 4; i <= maxValue; i += tickStep) {
      additionalTicks.push(i)
    }

    // Make sure the max value is included as a tick
    if (additionalTicks.length > 0 && additionalTicks[additionalTicks.length - 1] < maxValue) {
      additionalTicks.push(maxValue)
    }

    return [...baseTicks, ...additionalTicks]
  }

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="h-[450px] w-full">
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: isMobile ? 0 : 30,
            left: isMobile ? 10 : 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            tickMargin={8}
            interval={isMobile ? Math.floor(data.length / 5) : Math.floor(data.length / 10)}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            domain={[0, calculateMaxAhr999Value()]}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickMargin={isMobile ? 4 : 8}
            ticks={generateAhr999Ticks(calculateMaxAhr999Value())}
            width={isMobile ? 25 : 40}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={priceDomain}
            tickFormatter={formatYAxisPrice}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickMargin={isMobile ? 2 : 8}
            tickCount={isMobile ? 5 : 6}
            width={isMobile ? 35 : 55}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Reference lines for AHR999 zones */}
          <ReferenceLine
            y={0.45}
            yAxisId="left"
            stroke="#f59e0b"
            strokeDasharray="3 3"
            label={{ value: "0.45", position: "left", fill: "#f59e0b", fontSize: 12, offset: 10 }}
          />
          <ReferenceLine
            y={1.2}
            yAxisId="left"
            stroke="#10b981"
            strokeDasharray="3 3"
            label={{ value: "1.2", position: "left", fill: "#10b981", fontSize: 12, offset: 10 }}
          />

          {/* Data lines */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="ahr999"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="AHR999 Index"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="daily_close"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Bitcoin Price"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avg_200_day_cost"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
            name="200-Day Average"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Zone description - moved below the chart */}
      <div className="mt-4 mb-2 text-xs sm:text-sm grid grid-cols-3 gap-1 sm:gap-2">
        <div className="p-1 sm:p-2 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-100 dark:border-amber-800/30">
          <p className="font-medium text-amber-600 dark:text-amber-400">AHR999 Index &lt; 0.45</p>
          <p className="font-bold">{zoneStats.bottomFishing} days</p>
        </div>
        <div className="p-1 sm:p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800/30">
          <p className="font-medium text-blue-600 dark:text-blue-400">AHR999 Index 0.45 - 1.2</p>
          <p className="font-bold">{zoneStats.dcaZone} days</p>
        </div>
        <div className="p-1 sm:p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-100 dark:border-green-800/30">
          <p className="font-medium text-green-600 dark:text-green-400">AHR999 Index &gt; 1.2</p>
          <p className="font-bold">{zoneStats.bullMarket} days</p>
        </div>
      </div>
    </div>
  )
}

