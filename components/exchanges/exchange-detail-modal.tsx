"use client"

import Image from "next/image"
import { ExternalLink, Calendar, Globe, BarChart3, Award, Info } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatNumber } from "@/lib/formatters"
import type { Exchange } from "@/types/exchange"
import { useIsMobile } from "@/hooks/use-mobile"

interface ExchangeDetailModalProps {
  exchange: Exchange | null
  isOpen: boolean
  onClose: () => void
}

export function ExchangeDetailModal({ exchange, isOpen, onClose }: ExchangeDetailModalProps) {
  const isMobile = useIsMobile()

  if (!exchange) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-auto">
        <DialogHeader className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-shrink-0 h-12 w-12 sm:h-16 sm:w-16 relative">
            <Image
              src={exchange.image || "/placeholder.svg?height=64&width=64"}
              alt={exchange.name}
              width={isMobile ? 48 : 64}
              height={isMobile ? 48 : 64}
              className="rounded-full"
            />
          </div>
          <div>
            <DialogTitle className="text-xl sm:text-2xl flex items-center flex-wrap gap-2">
              {exchange.name}
              <Badge
                variant={exchange.trust_score >= 8 ? "bitcoin" : "outline"}
                className={`
                  ${
                    exchange.trust_score >= 8
                      ? ""
                      : exchange.trust_score >= 6
                        ? "text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700"
                        : "text-red-600 dark:text-red-400 border-red-300 dark:border-red-700"
                  }
                `}
              >
                Trust Score: {exchange.trust_score}/10
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Rank #{exchange.trust_score_rank} • {exchange.country || "Unknown Location"}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          {exchange.description && (
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Info className="h-5 w-5 text-bitcoin" />
                About
              </h3>
              <p className="text-sm text-muted-foreground">{exchange.description || "No description available."}</p>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bitcoin-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-bitcoin" />
                <h3 className="text-base font-medium">Trading Volume</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">24h Volume (BTC)</span>
                  <span className="text-sm font-medium">
                    {exchange.trade_volume_24h_btc !== null ? formatNumber(exchange.trade_volume_24h_btc) : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">24h Volume (USD)</span>
                  <span className="text-sm font-medium">{formatCurrency(exchange.trade_volume_24h_usd, 0)}</span>
                </div>
                {exchange.trade_volume_24h_btc_normalized !== null && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Normalized Volume (BTC)</span>
                    <span className="text-sm font-medium">
                      {formatNumber(exchange.trade_volume_24h_btc_normalized)}
                    </span>
                  </div>
                )}
                {exchange.trade_volume_24h_usd_normalized !== null && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Normalized Volume (USD)</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(exchange.trade_volume_24h_usd_normalized, 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bitcoin-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-bitcoin" />
                <h3 className="text-base font-medium">Trust & Ranking</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Trust Score</span>
                  <Badge
                    variant={exchange.trust_score >= 8 ? "bitcoin" : "outline"}
                    className={`
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
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Trust Score Rank</span>
                  <span className="text-sm font-medium">#{exchange.trust_score_rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bitcoin-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-bitcoin" />
                <h3 className="text-base font-medium">Establishment</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Year Established</span>
                  <span className="text-sm font-medium">{exchange.year_established || "Unknown"}</span>
                </div>
              </div>
            </div>

            <div className="bitcoin-stat-card">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-bitcoin" />
                <h3 className="text-base font-medium">Location</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Country</span>
                  <span className="text-sm font-medium">{exchange.country || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Website</span>
                  <a
                    href={exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bitcoin hover:text-bitcoin-dark dark:hover:text-blue-300 inline-flex items-center text-sm"
                  >
                    Visit <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-4">
            <Button
              variant="bitcoin"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => window.open(exchange.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit {exchange.name}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

