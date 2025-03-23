"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import { db } from "@/lib/firebase"
import type { CryptoData, MarketData } from "@/types/crypto"
import { formatCurrency, formatDate } from "@/lib/formatters"
import { CoinDetailModal } from "./coin-detail-modal"
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

const COINS_PER_PAGE = 20

export function CryptoMarketData() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCoin, setSelectedCoin] = useState<CryptoData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const isMobile = useIsMobile()

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "market_data", "current_crypto_data"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setMarketData(docSnapshot.data() as MarketData)
        } else {
          setError("No market data found")
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching market data:", err)
        setError("Failed to fetch cryptocurrency market data")
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Filter coins based on active tab
  const getFilteredCoins = () => {
    if (!marketData?.coins) return []

    switch (activeTab) {
      case "top10":
        return marketData.coins.slice(0, 10)
      case "stablecoins":
        return marketData.coins.filter((coin) => ["tether", "usd-coin", "usds", "dai", "binance-usd"].includes(coin.id))
      default:
        return marketData.coins
    }
  }

  const filteredCoins = getFilteredCoins()
  const totalPages = Math.ceil(filteredCoins.length / COINS_PER_PAGE)

  // Get current page coins
  const getCurrentPageCoins = () => {
    const startIndex = (currentPage - 1) * COINS_PER_PAGE
    return filteredCoins.slice(startIndex, startIndex + COINS_PER_PAGE)
  }

  const handleCoinClick = (e: React.MouseEvent, coin: CryptoData) => {
    // Prevent default behavior to avoid scrolling
    e.preventDefault()
    e.stopPropagation()

    // Store the current scroll position
    const scrollPosition = window.scrollY

    // Open the modal
    setSelectedCoin(coin)
    setIsModalOpen(true)

    // Ensure the scroll position is maintained
    setTimeout(() => {
      window.scrollTo(0, scrollPosition)
    }, 0)
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    // Scroll to top of the table
    document.getElementById("crypto-table-top")?.scrollIntoView({ behavior: "smooth" })
  }

  // Generate pagination items
  const getPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5 // Maximum number of page links to show

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

  if (loading) {
    return (
      <Card variant="bitcoin" className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto border-red-200 dark:border-red-900">
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

  const currentPageCoins = getCurrentPageCoins()

  return (
    <section className="mb-12">
      <Card variant="bitcoin" className="w-full max-w-4xl mx-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-bitcoin-dark dark:text-white">Cryptocurrency Market</CardTitle>
              <CardDescription className="dark:text-gray-300">Real-time prices and market data</CardDescription>
            </div>
            <div className="text-xs text-muted-foreground">Last updated: {formatDate(marketData?.timestamp || "")}</div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4 bg-bitcoin-background dark:bg-gray-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
                All Coins
              </TabsTrigger>
              <TabsTrigger value="top10" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
                Top 10
              </TabsTrigger>
              <TabsTrigger
                value="stablecoins"
                className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
              >
                Stablecoins
              </TabsTrigger>
            </TabsList>

            <div id="crypto-table-top" className="overflow-x-auto">
              <table className={`w-full min-w-[640px] table-auto ${isMobile ? "text-sm" : ""}`}>
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Coin
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      24h %
                    </th>
                    {!isMobile && (
                      <>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Market Cap
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Volume (24h)
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentPageCoins.map((coin) => (
                    <tr
                      key={coin.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={(e) => handleCoinClick(e, coin)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {coin.market_cap_rank}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 relative">
                            <Image
                              src={coin.image || "/placeholder.svg"}
                              alt={coin.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{coin.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                        <div
                          className={`flex items-center justify-end ${
                            coin.price_change_percentage_24h > 0
                              ? "text-green-600 dark:text-green-400"
                              : coin.price_change_percentage_24h < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {coin.price_change_percentage_24h > 0 ? (
                            <ChevronUp className="h-4 w-4 mr-1" />
                          ) : coin.price_change_percentage_24h < 0 ? (
                            <ChevronDown className="h-4 w-4 mr-1" />
                          ) : (
                            <ChevronsUpDown className="h-4 w-4 mr-1" />
                          )}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </td>
                      {!isMobile && (
                        <>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                            {formatCurrency(coin.market_cap, 0)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                            {formatCurrency(coin.total_volume, 0)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent className={isMobile ? "gap-0.5" : ""}>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={isMobile ? "px-2" : ""}
                      />
                    </PaginationItem>

                    {isMobile ? (
                      // Simplified pagination for mobile
                      <>
                        <PaginationItem>
                          <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1}>
                            1
                          </PaginationLink>
                        </PaginationItem>

                        {currentPage > 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        {currentPage > 2 && (
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
                              {currentPage - 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage !== 1 && currentPage !== totalPages && (
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage)} isActive={true}>
                              {currentPage}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage < totalPages - 1 && (
                          <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
                              {currentPage + 1}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                        {currentPage < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}

                        {totalPages > 1 && (
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(totalPages)}
                              isActive={currentPage === totalPages}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                      </>
                    ) : (
                      // Original pagination for desktop
                      getPaginationItems()
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={isMobile ? "px-2" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center text-sm text-muted-foreground mt-2">
                  Showing {(currentPage - 1) * COINS_PER_PAGE + 1}-
                  {Math.min(currentPage * COINS_PER_PAGE, filteredCoins.length)} of {filteredCoins.length} coins
                </div>
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Coin Detail Modal */}
      <CoinDetailModal coin={selectedCoin} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  )
}

