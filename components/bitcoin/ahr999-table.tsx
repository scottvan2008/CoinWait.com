"use client"

import { useState, useEffect } from "react"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useIsMobile } from "@/hooks/use-mobile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronDown, ChevronUp, ChevronsUpDown, Filter, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChartDataPoint {
  date: string
  ahr999: number
  daily_close: number
  avg_200_day_cost: number
}

interface AHR999TableProps {
  data: ChartDataPoint[]
  selectedYear?: string
}

export function AHR999Table({ data, selectedYear = "all" }: AHR999TableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const isMobile = useIsMobile()

  // Reset pagination when year changes or items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedYear, itemsPerPage])

  // Add a handler for items per page change
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
  }

  // Sort data by date in descending order (newest first)
  const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Calculate total pages
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // Get current page data
  const currentData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Get market phase based on AHR999 value
  const getMarketPhase = (value: number): { phase: string; color: string; bgColor: string } => {
    if (value >= 4)
      return {
        phase: "Extreme Overvaluation",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/20",
      }
    if (value >= 1.2)
      return {
        phase: "Bull Market",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/20",
      }
    if (value >= 0.45)
      return {
        phase: "DCA Zone",
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
      }
    return {
      phase: "Bottom Fishing",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
    }
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = isMobile ? 3 : 5

    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>,
    )

    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3) + 1)
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={`page-${i}`}>
          <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      )
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={`page-${totalPages}`}>
          <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  // Get trend icon based on AHR999 value change
  const getTrendIcon = (current: number, previous: number | undefined) => {
    if (!previous) return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
    if (current > previous) return <ChevronUp className="h-4 w-4 text-green-500" />
    if (current < previous) return <ChevronDown className="h-4 w-4 text-red-500" />
    return <ChevronsUpDown className="h-4 w-4 text-gray-400" />
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <Info className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-muted-foreground">No historical data available</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-bitcoin" />
            <h3 className="text-lg font-medium text-bitcoin-dark dark:text-white">Historical AHR999 Data</h3>
            {selectedYear !== "all" && (
              <Badge variant="outline" className="ml-2 bg-bitcoin/10 text-bitcoin-dark dark:text-white">
                {selectedYear}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground whitespace-nowrap">Show</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="365">All</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">entries</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-2">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries, sorted by most recent date first
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr className="bg-gradient-to-r from-bitcoin-background to-bitcoin-background/70 dark:from-gray-800 dark:to-gray-800/90">
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-bitcoin-dark dark:text-white uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-bitcoin-dark dark:text-white uppercase tracking-wider"
                >
                  AHR999 Index
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-bitcoin-dark dark:text-white uppercase tracking-wider"
                >
                  Market Phase
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-bitcoin-dark dark:text-white uppercase tracking-wider"
                >
                  Bitcoin Price
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium text-bitcoin-dark dark:text-white uppercase tracking-wider"
                >
                  200-Day Average
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.map((item, index) => {
                const marketPhase = getMarketPhase(item.ahr999)
                const prevItem = sortedData[sortedData.indexOf(item) + 1]

                return (
                  <tr
                    key={item.date}
                    className={`
                      ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/30"} 
                      hover:bg-bitcoin-background/20 dark:hover:bg-bitcoin/5 transition-colors
                    `}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-bitcoin mr-2 flex-shrink-0" />
                        <span className="font-medium text-gray-900 dark:text-white">{formatDateOnly(item.date)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(item.ahr999, prevItem?.ahr999)}
                        <span className="ml-1.5 font-mono font-medium text-gray-900 dark:text-white">
                          {item.ahr999.toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${marketPhase.color} ${marketPhase.bgColor}`}
                      >
                        {marketPhase.phase}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className="font-mono font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.daily_close)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className="font-mono text-gray-700 dark:text-gray-300">
                        {formatCurrency(item.avg_200_day_cost)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1 whitespace-nowrap">
            Page {currentPage} of {totalPages}
          </div>

          <Pagination className="order-1 sm:order-2">
            <PaginationContent className={isMobile ? "gap-0.5" : ""}>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={isMobile ? "px-2" : ""}
                />
              </PaginationItem>

              {getPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={isMobile ? "px-2" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

