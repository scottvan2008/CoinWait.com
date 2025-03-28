"use client"

import { CalendarDay } from "./calendar-day"
import { CalendarHeader } from "./calendar-header"

interface CalendarMonthGridProps {
  year: number
  month: number
  priceData: Record<string, number>
}

export function CalendarMonthGrid({ year, month, priceData }: CalendarMonthGridProps) {
  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1)

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay()

  // Get the number of days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Calculate the number of rows needed (including partial weeks)
  const numRows = Math.ceil((firstDayOfWeek + daysInMonth) / 7)

  // Generate calendar days
  const days = []
  let dayCounter = 1

  for (let row = 0; row < numRows; row++) {
    const weekDays = []

    for (let col = 0; col < 7; col++) {
      if ((row === 0 && col < firstDayOfWeek) || dayCounter > daysInMonth) {
        // Empty cell for days outside the current month
        weekDays.push(
          <td
            key={`empty-${row}-${col}`}
            className="border border-gray-200 dark:border-gray-700 p-0.5 sm:p-1 h-14 sm:h-16 bg-gray-50 dark:bg-gray-800"
          ></td>,
        )
      } else {
        // Format the date string to match the Firestore format (YYYY-MM-DD)
        // Use manual formatting to avoid timezone issues
        const formattedMonth = (month + 1).toString().padStart(2, "0")
        const formattedDay = dayCounter.toString().padStart(2, "0")
        const dateString = `${year}-${formattedMonth}-${formattedDay}`

        // Get the price for the current day
        const price = priceData[dateString]

        // Get the price for the previous day
        let prevDay = dayCounter - 1
        let prevMonth = month
        let prevYear = year

        // Handle month/year boundaries for previous day
        if (prevDay < 1) {
          prevMonth = month - 1
          if (prevMonth < 0) {
            prevMonth = 11
            prevYear = year - 1
          }
          prevDay = new Date(prevYear, prevMonth + 1, 0).getDate()
        }

        const formattedPrevMonth = (prevMonth + 1).toString().padStart(2, "0")
        const formattedPrevDay = prevDay.toString().padStart(2, "0")
        const prevDateString = `${prevYear}-${formattedPrevMonth}-${formattedPrevDay}`

        const prevPrice = priceData[prevDateString]

        // Calculate price change
        const priceChange = price && prevPrice ? ((price - prevPrice) / prevPrice) * 100 : null

        weekDays.push(
          <CalendarDay
            key={dayCounter}
            day={dayCounter}
            price={price}
            priceChange={priceChange}
            isToday={isToday(year, month, dayCounter)}
          />,
        )

        dayCounter++
      }
    }

    days.push(<tr key={`row-${row}`}>{weekDays}</tr>)
  }

  return (
    <div className="overflow-x-auto shadow-sm rounded-lg">
      <table className="w-full border-collapse">
        <CalendarHeader />
        <tbody>{days}</tbody>
      </table>
    </div>
  )
}

// Helper function to check if a date is today
function isToday(year: number, month: number, day: number): boolean {
  const today = new Date()
  return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day
}

