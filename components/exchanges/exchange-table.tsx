"use client"

import Image from "next/image"
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import type { Exchange, SortDirection, SortField } from "@/types/exchange"
import { useIsMobile } from "@/hooks/use-mobile"
import { ExchangeDetailModal } from "./exchange-detail-modal"
import { useState } from "react"

interface ExchangeTableProps {
  exchanges: Exchange[]
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  onItemsPerPageChange: (items: number) => void
  totalItems: number
}

export function ExchangeTable({
  exchanges,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
}: ExchangeTableProps) {
  const isMobile = useIsMobile()
  const [selectedExchange, setSelectedExchange] = useState<Exchange | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleExchangeClick = (exchange: Exchange) => {
    setSelectedExchange(exchange)
    setIsModalOpen(true)
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = isMobile ? 3 : 5

    // Always show first page
    items.push(
      <PaginationItem key="page-1">
        <PaginationLink onClick={() => onPageChange(1)} isActive={currentPage === 1}>
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
          <PaginationLink onClick={() => onPageChange(i)} isActive={currentPage === i}>
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
          <PaginationLink onClick={() => onPageChange(totalPages)} isActive={currentPage === totalPages}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      )
    }

    return items
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] table-auto text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-1 sm:px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                <button onClick={() => onSort("trust_score_rank")} className="flex items-center focus:outline-none">
                  #{renderSortIcon("trust_score_rank")}
                </button>
              </th>
              <th className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <button onClick={() => onSort("name")} className="flex items-center focus:outline-none">
                  Exchange
                  {renderSortIcon("name")}
                </button>
              </th>
              {!isMobile ? (
                <>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => onSort("trust_score")}
                      className="flex items-center justify-end ml-auto focus:outline-none"
                    >
                      Trust Score
                      {renderSortIcon("trust_score")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => onSort("trade_volume_24h_btc")}
                      className="flex items-center justify-end ml-auto focus:outline-none"
                    >
                      24h Volume (BTC)
                      {renderSortIcon("trade_volume_24h_btc")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => onSort("trade_volume_24h_usd")}
                      className="flex items-center justify-end ml-auto focus:outline-none"
                    >
                      24h Volume (USD)
                      {renderSortIcon("trade_volume_24h_usd")}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Website
                  </th>
                </>
              ) : (
                <>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => onSort("trade_volume_24h_usd")}
                      className="flex items-center justify-end focus:outline-none"
                    >
                      Volume (USD)
                      {renderSortIcon("trade_volume_24h_usd")}
                    </button>
                  </th>
                  <th className="px-2 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => onSort("trust_score")}
                      className="flex items-center justify-end focus:outline-none"
                    >
                      Trust
                      {renderSortIcon("trust_score")}
                    </button>
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Link
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {exchanges.map((exchange) => (
              <tr
                key={exchange.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleExchangeClick(exchange)}
              >
                <td className="px-1 sm:px-2 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  {exchange.trust_score_rank}
                </td>
                <td className="px-2 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 relative">
                      <Image
                        src={exchange.image || "/placeholder.svg?height=32&width=32"}
                        alt={exchange.name}
                        width={isMobile ? 24 : 32}
                        height={isMobile ? 24 : 32}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-2 sm:ml-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                        {isMobile
                          ? exchange.name.length > 12
                            ? exchange.name.substring(0, 12) + "..."
                            : exchange.name
                          : exchange.name}
                      </div>
                    </div>
                  </div>
                </td>
                {!isMobile ? (
                  <>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                      <Badge
                        variant={exchange.trust_score >= 8 ? "bitcoin" : "outline"}
                        className={`
                          ml-auto inline-flex
                          ${
                            exchange.trust_score >= 8
                              ? ""
                              : exchange.trust_score >= 6
                                ? "text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700"
                                : "text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
                          }
                        `}
                      >
                        {exchange.trust_score}/10
                      </Badge>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      {exchange.trade_volume_24h_btc !== null ? formatNumber(exchange.trade_volume_24h_btc) : "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      {formatCurrency(exchange.trade_volume_24h_usd, 0)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                      <a
                        href={exchange.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bitcoin hover:text-bitcoin-dark dark:hover:text-blue-300 inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ExternalLink className="h-5 w-5" />
                        <span className="sr-only">Visit website</span>
                      </a>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-2 py-3 whitespace-nowrap text-xs text-right text-gray-900 dark:text-white">
                      {formatCurrency(exchange.trade_volume_24h_usd, 0)}
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-right">
                      <Badge
                        variant={exchange.trust_score >= 8 ? "bitcoin" : "outline"}
                        className={`
                          text-xs px-1.5 py-0.5
                          ${
                            exchange.trust_score >= 8
                              ? ""
                              : exchange.trust_score >= 6
                                ? "text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700"
                                : "text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
                          }
                        `}
                      >
                        {exchange.trust_score}
                      </Badge>
                    </td>
                    <td className="px-2 py-3 whitespace-nowrap text-center">
                      <a
                        href={exchange.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-bitcoin hover:text-bitcoin-dark dark:hover:text-blue-300 inline-flex items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Visit website</span>
                      </a>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number.parseInt(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>

        <Pagination>
          <PaginationContent className={isMobile ? "gap-0.5" : ""}>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={isMobile ? "px-2" : ""}
              />
            </PaginationItem>

            {getPaginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={isMobile ? "px-2" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
          {totalItems} exchanges
        </div>
      </div>

      {/* Exchange Detail Modal */}
      <ExchangeDetailModal exchange={selectedExchange} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

