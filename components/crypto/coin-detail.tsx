"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react"
import Image from "next/image"
import type { CryptoData } from "@/types/crypto"
import { formatCurrency } from "@/lib/formatters"
import { CoinDetailModal } from "./coin-detail-modal"

interface CoinDetailProps {
  coin: CryptoData
  compact?: boolean
}

export function CoinDetail({ coin, compact = false }: CoinDetailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Calculate the percentage between ATL and ATH where current price sits
  const calculatePricePosition = () => {
    const range = coin.ath - coin.atl
    const position = coin.current_price - coin.atl
    return (position / range) * 100
  }

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent default behavior to avoid scrolling
    e.preventDefault()
    e.stopPropagation()

    // Store the current scroll position
    const scrollPosition = window.scrollY

    // Open the modal
    setIsModalOpen(true)

    // Ensure the scroll position is maintained
    setTimeout(() => {
      window.scrollTo(0, scrollPosition)
    }, 0)
  }

  if (compact) {
    return (
      <>
        <Card
          variant="bitcoin"
          className="cursor-pointer hover:shadow-md transition-shadow h-full"
          onClick={handleCardClick}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex-shrink-0 h-8 w-8 relative">
                <Image
                  src={coin.image || "/placeholder.svg"}
                  alt={coin.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="font-medium text-bitcoin-dark dark:text-white">{coin.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{coin.symbol}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-lg font-bold text-bitcoin-dark dark:text-white">
                {formatCurrency(coin.current_price)}
              </div>
              <div
                className={`flex items-center text-xs ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-600 dark:text-green-400"
                    : coin.price_change_percentage_24h < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {coin.price_change_percentage_24h > 0 ? (
                  <ChevronUp className="h-3 w-3 mr-1" />
                ) : coin.price_change_percentage_24h < 0 ? (
                  <ChevronDown className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronsUpDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
              </div>
            </div>

            {/* Price Range Indicator */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <div>
                  <div className="text-[10px] font-medium">All Time Low</div>
                  <div>{formatCurrency(coin.atl)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-medium">All Time High</div>
                  <div>{formatCurrency(coin.ath)}</div>
                </div>
              </div>
              <div className="relative mt-1">
                <Progress variant="bitcoin" value={calculatePricePosition()} className="h-1.5" />
                <div
                  className="absolute top-0 h-3 w-1.5 bg-white dark:bg-blue-400 border border-bitcoin rounded-full -mt-0.5"
                  style={{ left: `${calculatePricePosition()}%`, transform: "translateX(-50%)" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coin Detail Modal */}
        <CoinDetailModal coin={coin} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    )
  }

  return (
    <>
      <Card
        variant="bitcoin"
        className="w-full mb-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 relative mr-3">
                <Image
                  src={coin.image || "/placeholder.svg"}
                  alt={coin.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
              <div>
                <div className="text-xl text-bitcoin-dark dark:text-white flex items-center">
                  {coin.name}
                  <span className="text-sm text-gray-500 dark:text-gray-400 uppercase ml-2">{coin.symbol}</span>
                </div>
                <div className="text-sm text-muted-foreground">Rank #{coin.market_cap_rank}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-bitcoin-dark dark:text-white">
                {formatCurrency(coin.current_price)}
              </div>
              <div
                className={`flex items-center justify-end text-sm ${
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
                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}% (24h)
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {/* Price Range Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>All Time Low: {formatCurrency(coin.atl)}</span>
                <span>All Time High: {formatCurrency(coin.ath)}</span>
              </div>
              <div className="relative">
                <Progress variant="bitcoin" value={calculatePricePosition()} className="h-2" />
                <div
                  className="absolute top-0 h-4 w-2 bg-white dark:bg-blue-400 border border-bitcoin rounded-full -mt-1"
                  style={{ left: `${calculatePricePosition()}%`, transform: "translateX(-50%)" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coin Detail Modal */}
      <CoinDetailModal coin={coin} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}

