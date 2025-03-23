"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import type { MarketData } from "@/types/crypto"
import { CryptoMarketData } from "./market-data"
import { CoinDetail } from "./coin-detail"

export function CryptoDashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
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

  return (
    <section>
      {/* Top Coins Detail View */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-bitcoin-dark dark:text-white">Top Cryptocurrencies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {marketData?.coins.slice(0, 3).map((coin) => (
            <CoinDetail key={coin.id} coin={coin} compact={true} />
          ))}
        </div>
      </div>

      {/* Market Data Table */}
      <CryptoMarketData />
    </section>
  )
}

