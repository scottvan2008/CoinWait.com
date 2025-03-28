"use client"

import { useState, useMemo, useCallback } from "react"
import { formatCurrency } from "@/lib/formatters"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowDown,
  ArrowUp,
  Minus,
  Calendar,
  Clock,
  DollarSign,
  PercentIcon,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface PriceModelTableProps {
  data: {
    date: string
    daysSinceBirth: number
    predictedPrice: number
    actualPrice?: number
  }[]
  isFutureYear?: boolean
}

export function PriceModelTable({ data, isFutureYear = false }: PriceModelTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)
  const isMobile = useIsMobile()

  // Memoize pagination calculations
  const { totalItems, totalPages, startIndex, paginatedData } = useMemo(() => {
    const totalItems = data.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

    return {
      totalItems,
      totalPages,
      startIndex,
      paginatedData,
    }
  }, [data, currentPage, itemsPerPage])

  // Calculate summary metrics for the current page
  const summaryMetrics = useMemo(() => {
    if (paginatedData.length === 0) return null

    let overvaluedCount = 0
    let undervaluedCount = 0
    let neutralCount = 0
    let totalDifference = 0
    let diffCount = 0

    paginatedData.forEach((item) => {
      if (item.actualPrice) {
        const diff = ((item.actualPrice - item.predictedPrice) / item.predictedPrice) * 100
        totalDifference += diff
        diffCount++

        if (diff > 10) overvaluedCount++
        else if (diff < -10) undervaluedCount++
        else neutralCount++
      }
    })

    return {
      overvaluedCount,
      undervaluedCount,
      neutralCount,
      averageDifference: diffCount > 0 ? totalDifference / diffCount : 0,
    }
  }, [paginatedData])

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
      // Scroll to top of the table
      document.getElementById("price-model-table-top")?.scrollIntoView({ behavior: "smooth" })
    },
    [totalPages],
  )

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }, [])

  // Calculate price difference percentage
  const calculateDifference = (actual: number | undefined, predicted: number): number | null => {
    if (actual === undefined || predicted === 0) return null
    return ((actual - predicted) / predicted) * 100
  }

  // Get CSS class for difference
  const getDifferenceClass = (difference: number | null): string => {
    if (difference === null) return "text-gray-400"
    if (difference > 20) return "text-green-600 dark:text-green-400 font-medium"
    if (difference > 10) return "text-green-500 dark:text-green-500"
    if (difference < -20) return "text-red-600 dark:text-red-400 font-medium"
    if (difference < -10) return "text-red-500 dark:text-red-500"
    return "text-gray-600 dark:text-gray-400"
  }

  // Get background class for difference
  const getDifferenceBackground = (difference: number | null): string => {
    if (difference === null) return ""
    if (difference > 20) return "bg-green-50 dark:bg-green-900/10"
    if (difference > 10) return "bg-green-50/50 dark:bg-green-900/5"
    if (difference < -20) return "bg-red-50 dark:bg-red-900/10"
    if (difference < -10) return "bg-red-50/50 dark:bg-red-900/5"
    return ""
  }

  // Get trend icon based on difference
  const getTrendIcon = (difference: number | null) => {
    if (difference === null) return <Minus className="h-4 w-4" />
    if (difference > 20) return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    if (difference > 10) return <ArrowUp className="h-4 w-4 text-green-500 dark:text-green-500" />
    if (difference < -20) return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
    if (difference < -10) return <ArrowDown className="h-4 w-4 text-red-500 dark:text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    // Return MM-DD format on mobile, YYYY-MM-DD on desktop
    return isMobile ? `${month}-${day}` : `${year}-${month}-${day}`
  }

  // Memoize pagination items
  const paginationItems = useMemo(() => {
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
  }, [currentPage, totalPages, isMobile, handlePageChange])

  return (
    <div>
      {/* Add a notice for future years */}
      {isFutureYear && (
        <div className="p-4 mb-4 bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200 dark:border-amber-800/30 rounded-lg text-amber-800 dark:text-amber-300 text-sm shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-full flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                />
              </svg>
            </div>
            <div>
              <strong className="font-medium">Future Prediction:</strong> This is a future year showing only predicted
              prices based on the mathematical model. No actual price data is available.
            </div>
          </div>
        </div>
      )}

      {/* Summary metrics cards */}
      {summaryMetrics && !isFutureYear && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 max-w-3xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800/30 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Average Difference</p>
                <p
                  className={`text-lg font-bold ${summaryMetrics.averageDifference > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {summaryMetrics.averageDifference > 0 ? "+" : ""}
                  {summaryMetrics.averageDifference.toFixed(2)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500/50 dark:text-blue-400/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800/30 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-green-700 dark:text-green-400 font-medium">Overvalued Days</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">{summaryMetrics.overvaluedCount}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500/50 dark:text-green-400/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 border-red-200 dark:border-red-800/30 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-red-700 dark:text-red-400 font-medium">Undervalued Days</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{summaryMetrics.undervaluedCount}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500/50 dark:text-red-400/50" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/20 dark:to-gray-700/10 border-gray-200 dark:border-gray-700/30 shadow-sm">
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-700 dark:text-gray-400 font-medium">Neutral Days</p>
                <p className="text-lg font-bold text-gray-600 dark:text-gray-300">{summaryMetrics.neutralCount}</p>
              </div>
              <Minus className="h-8 w-8 text-gray-500/50 dark:text-gray-400/50" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm max-w-3xl mx-auto">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Show</span>
          <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-28 h-9 text-xs">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="366">Full Year</SelectItem>
              <SelectItem value="100">100 days</SelectItem>
              <SelectItem value="50">50 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="20">20 days</SelectItem>
              <SelectItem value="10">10 days</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs sm:text-sm text-muted-foreground">days</span>
        </div>

        <div className="text-xs sm:text-sm text-muted-foreground text-center w-full sm:w-auto">
          Showing <span className="font-medium text-bitcoin-dark dark:text-white">{startIndex + 1}</span> to{" "}
          <span className="font-medium text-bitcoin-dark dark:text-white">
            {Math.min(startIndex + itemsPerPage, totalItems)}
          </span>{" "}
          of <span className="font-medium text-bitcoin-dark dark:text-white">{totalItems}</span> entries
        </div>
      </div>

      {/* Main table */}
      <div
        id="price-model-table-top"
        className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-md max-w-3xl mx-auto"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-bitcoin-background to-bitcoin-background/70 dark:from-gray-800 dark:to-gray-800/90">
                <th className="border-b border-gray-200 dark:border-gray-700 p-2 text-left font-medium text-bitcoin-dark dark:text-white">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-bitcoin" />
                    <span>Date</span>
                  </div>
                </th>
                <th className="border-b border-gray-200 dark:border-gray-700 p-2 text-right font-medium text-bitcoin-dark dark:text-white">
                  <div className="flex items-center justify-end gap-1.5">
                    <Clock className="h-4 w-4 text-bitcoin" />
                    <span>Days Since Birth</span>
                  </div>
                </th>
                <th className="border-b border-gray-200 dark:border-gray-700 p-2 text-right font-medium text-bitcoin-dark dark:text-white">
                  <div className="flex items-center justify-end gap-1.5">
                    <DollarSign className="h-4 w-4 text-bitcoin" />
                    <span>Predicted Price</span>
                  </div>
                </th>
                <th className="border-b border-gray-200 dark:border-gray-700 p-2 text-right font-medium text-bitcoin-dark dark:text-white">
                  <div className="flex items-center justify-end gap-1.5">
                    <DollarSign className="h-4 w-4 text-bitcoin" />
                    <span>Actual Price</span>
                  </div>
                </th>
                <th className="border-b border-gray-200 dark:border-gray-700 p-2 text-right font-medium text-bitcoin-dark dark:text-white">
                  <div className="flex items-center justify-end gap-1.5">
                    <PercentIcon className="h-4 w-4 text-bitcoin" />
                    <span>Difference</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => {
                const difference = calculateDifference(item.actualPrice, item.predictedPrice)
                const isEven = index % 2 === 0
                const rowClass = isEven ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/30"

                return (
                  <tr
                    key={item.date}
                    className={`${rowClass} hover:bg-bitcoin-background/20 dark:hover:bg-bitcoin/5 transition-colors`}
                  >
                    <td className="border-b border-gray-100 dark:border-gray-800 p-2 text-left">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{formatDate(item.date)}</span>
                    </td>
                    <td className="border-b border-gray-100 dark:border-gray-800 p-2 text-right">
                      <span className="font-mono text-gray-600 dark:text-gray-400">
                        {item.daysSinceBirth.toLocaleString()}
                      </span>
                    </td>
                    <td className="border-b border-gray-100 dark:border-gray-800 p-2 text-right">
                      <span className="font-mono font-medium text-bitcoin-dark dark:text-white">
                        {formatCurrency(item.predictedPrice, item.predictedPrice > 1000 ? 0 : 2)}
                      </span>
                    </td>
                    <td className="border-b border-gray-100 dark:border-gray-800 p-2 text-right">
                      {item.actualPrice !== undefined ? (
                        <span className="font-mono font-medium text-bitcoin-dark dark:text-white">
                          {formatCurrency(item.actualPrice, item.actualPrice > 1000 ? 0 : 2)}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Not available</span>
                      )}
                    </td>
                    <td
                      className={`border-b border-gray-100 dark:border-gray-800 p-2 text-right ${getDifferenceBackground(difference)}`}
                    >
                      {difference !== null ? (
                        <div className={`flex items-center justify-end gap-1 ${getDifferenceClass(difference)}`}>
                          {getTrendIcon(difference)}
                          <span className="font-mono">
                            {difference > 0 ? "+" : ""}
                            {difference.toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">N/A</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent className={isMobile ? "gap-0.5" : ""}>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={isMobile ? "px-2" : ""}
                />
              </PaginationItem>

              {paginationItems}

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

