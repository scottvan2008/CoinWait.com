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
import { formatCurrency, formatShortDate } from "@/lib/formatters"
import { useIsMobile } from "@/hooks/use-mobile"

interface PriceModelChartProps {
  data: Array<{
    date: string
    daysSinceBirth: number
    modelPrice: number
    actualPrice?: number
  }>
  isFutureYear?: boolean
}

export function PriceModelChart({ data, isFutureYear = false }: PriceModelChartProps) {
  const isMobile = useIsMobile()

  // Format date for display
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr)
    // Format as "Jan", "Feb", etc.
    return date.toLocaleString("default", { month: "short" })
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{formatShortDate(label)}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              <span className="font-medium">Model Price:</span> {formatCurrency(payload[0].value)}
            </p>
            {payload.length > 1 && payload[1].value !== undefined && (
              <p className="text-sm">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="font-medium">Actual Price:</span> {formatCurrency(payload[1].value)}
              </p>
            )}
            {payload.length > 1 && payload[1].value !== undefined && (
              <p className="text-sm">
                <span className="font-medium">Difference:</span>{" "}
                <span className={payload[1].value > payload[0].value ? "text-green-500" : "text-red-500"}>
                  {(((payload[1].value - payload[0].value) / payload[0].value) * 100).toFixed(2)}%
                </span>
              </p>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  // Calculate domain for price axis
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 100000]

    const modelPrices = data.map((d) => d.modelPrice)
    const actualPrices = data.filter((d) => d.actualPrice !== undefined).map((d) => d.actualPrice as number)

    // Ensure we have both model and actual prices for comparison
    const allPrices = [...modelPrices, ...actualPrices]

    // For logarithmic scale, we need to be careful with the min value
    // Find the minimum non-zero value to avoid log(0) issues
    const nonZeroPrices = allPrices.filter((price) => price > 0)
    const min = nonZeroPrices.length > 0 ? Math.min(...nonZeroPrices) : 1
    const max = Math.max(...allPrices)

    // Use smaller multipliers to keep the range closer to the data
    // For log scale, a 10-20% padding is usually sufficient
    const logMin = min * 0.9
    const logMax = max * 1.1

    return [logMin, logMax]
  }, [data])

  // Calculate tick interval based on data length
  const tickInterval = useMemo(() => {
    if (data.length <= 31) return 5 // For a month of data
    if (data.length <= 92) return 15 // For a quarter
    return 30 // For a year
  }, [data.length])

  // Format Y-axis ticks
  const formatYAxis = (value: number) => {
    // For very small values that might appear in log scale
    if (value < 1) return `$${value.toFixed(2)}`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    return `$${value.toFixed(0)}`
  }

  // Add a custom tick generator function to ensure better distribution of ticks on logarithmic scale
  const generateLogTicks = (min: number, max: number, count: number): number[] => {
    if (min <= 0) min = 0.1 // Avoid log(0) issues

    const minLog = Math.log10(min)
    const maxLog = Math.log10(max)
    const logRange = maxLog - minLog

    // If the range is very small, use linear ticks instead
    if (logRange < 0.3) {
      const linearTicks: number[] = []
      const step = (max - min) / count
      for (let i = 0; i <= count; i++) {
        linearTicks.push(min + step * i)
      }
      return linearTicks
    }

    // Otherwise use logarithmic ticks
    const ticks: number[] = []
    for (let i = 0; i <= count; i++) {
      const logValue = minLog + (logRange * i) / count
      ticks.push(Math.pow(10, logValue))
    }

    return ticks
  }

  if (data.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="h-[400px] w-full">
      {isFutureYear && (
        <div className="text-sm text-center text-amber-600 dark:text-amber-400 mb-2">
          Future year: Only model prices are shown (no actual price data available)
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: isMobile ? 10 : 30,
            left: isMobile ? 10 : 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickMargin={8}
            // Only show ticks for the first day of each month
            ticks={data
              .filter((item) => {
                const date = new Date(item.date)
                return date.getDate() === 1 // Only keep dates that are the 1st of the month
              })
              .map((item) => item.date)}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: isMobile ? 10 : 12 }}
            tickMargin={isMobile ? 4 : 8}
            width={isMobile ? 40 : 60}
            domain={yDomain}
            scale="log"
            allowDataOverflow={false}
            ticks={generateLogTicks(yDomain[0], yDomain[1], isMobile ? 5 : 8)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Model Price Line */}
          <Line
            type="monotone"
            dataKey="modelPrice"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            name="Model Price"
            activeDot={{ r: 6, strokeWidth: 2 }}
          />

          {/* Actual Price Line (only if not a future year) */}
          {!isFutureYear && (
            <Line
              type="monotone"
              dataKey="actualPrice"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Actual Price"
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          )}

          {/* Reference line for parity (where model price = actual price) */}
          <ReferenceLine
            y={0}
            stroke="#94A3B8"
            strokeDasharray="3 3"
            label={{
              value: "Parity",
              position: "insideBottomRight",
              fill: "#94A3B8",
              fontSize: 12,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

