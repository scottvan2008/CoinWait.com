"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { formatCurrency } from "@/lib/formatters"
import { useIsMobile } from "@/hooks/use-mobile"

interface CalendarDayProps {
  day: number
  price?: number
  priceChange?: number | null
  isToday?: boolean
}

export function CalendarDay({ day, price, priceChange, isToday = false }: CalendarDayProps) {
  // Check if on mobile
  const isMobile = useIsMobile()

  // Format price change for display
  const formattedPriceChange =
    priceChange !== null && priceChange !== undefined ? `${priceChange > 0 ? "+" : ""}${priceChange.toFixed(1)}%` : null

  // Determine cell background based on today's date
  const todayClass = isToday ? "bg-bitcoin/10 dark:bg-bitcoin/20" : ""

  // Determine price change color
  const priceChangeColor =
    priceChange === null || priceChange === undefined
      ? "text-gray-500"
      : priceChange > 0
        ? "text-green-600 dark:text-green-400"
        : priceChange < 0
          ? "text-red-600 dark:text-red-400"
          : "text-gray-500"

  // Determine the price background color based on the price change
  const priceBackground =
    priceChange === null || priceChange === undefined
      ? ""
      : priceChange > 0
        ? "bg-green-50 dark:bg-green-900/20"
        : priceChange < 0
          ? "bg-red-50 dark:bg-red-900/20"
          : ""

  // Format price with or without decimals based on screen size
  const formattedPrice =
    price !== undefined ? formatCurrency(price, price > 1000 || isMobile ? 0 : 2).replace("$", "") : undefined

  return (
    <td className={`border border-gray-200 dark:border-gray-700 p-0 sm:p-1 h-12 sm:h-16 align-top ${todayClass}`}>
      <div className="flex flex-col h-full">
        <div className={`text-xs sm:text-sm font-medium ${isToday ? "text-bitcoin dark:text-bitcoin" : ""}`}>{day}</div>

        {price !== undefined && (
          <div className="mt-auto w-full">
            <div
              className={`text-sm sm:text-base font-semibold text-bitcoin-dark dark:text-white px-1 py-0.5 rounded-md ${priceBackground} text-center mt-1`}
            >
              {formattedPrice}
            </div>

            {formattedPriceChange && (
              <div className={`text-xs flex items-center justify-center mt-0.5 ${priceChangeColor}`}>
                {priceChange > 0 ? (
                  <ChevronUp className="h-3 w-3 mr-0.5" />
                ) : priceChange < 0 ? (
                  <ChevronDown className="h-3 w-3 mr-0.5" />
                ) : null}
                {formattedPriceChange}
              </div>
            )}
          </div>
        )}
      </div>
    </td>
  )
}

