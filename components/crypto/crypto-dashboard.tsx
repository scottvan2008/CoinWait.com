"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { db } from "@/lib/firebase"
import type { MarketData, TimeFrame } from "@/types/crypto"
import { CryptoMarketData } from "./market-data"
import { CoinDetail } from "./coin-detail"

export function CryptoDashboard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("24h")

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
      {/* Time Frame Selection */}
      <div className="mb-4">
        <Tabs defaultValue="24h" className="w-full" onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
          <TabsList className="grid grid-cols-6 mb-4 bg-bitcoin-background dark:bg-gray-800">
            <TabsTrigger value="24h" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
              24h
            </TabsTrigger>
            <TabsTrigger value="7d" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
              7d
            </TabsTrigger>
            <TabsTrigger value="14d" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
              14d
            </TabsTrigger>
            <TabsTrigger value="30d" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
              30d
            </TabsTrigger>
            <TabsTrigger value="200d" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
              200d
            </TabsTrigger>
            <TabsTrigger value="1y" className="data-[state=active]:bg-bitcoin data-[state=active]:text-white">
              1y
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Top Coins Detail View */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-bitcoin-dark dark:text-white">Top Cryptocurrencies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {marketData?.coins.slice(0, 3).map((coin) => (
            <CoinDetail key={coin.id} coin={coin} compact={true} timeFrame={timeFrame} />
          ))}
        </div>
      </div>

      {/* Market Data Table */}
      <CryptoMarketData timeFrame={timeFrame} />
    </section>
  )
}

