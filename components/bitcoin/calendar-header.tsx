export function CalendarHeader() {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  // Use shorter day names on mobile
  const mobileWeekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <thead>
      <tr>
        {weekdays.map((day, index) => (
          <th
            key={day}
            className="border border-gray-200 dark:border-gray-700 p-1 sm:p-2 bg-bitcoin-background dark:bg-gray-800 text-bitcoin-dark dark:text-white text-center font-medium"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{mobileWeekdays[index]}</span>
          </th>
        ))}
      </tr>
    </thead>
  )
}

