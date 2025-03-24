"use client"

import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, DollarSign, Globe, Pickaxe } from "lucide-react"
import { db } from "@/lib/firebase"
import type { BitcoinStats } from "@/types/bitcoin"
import { formatNumber, formatCurrency, formatDate } from "@/lib/formatters"
import { useIsMobile } from "@/hooks/use-mobile"

export function BitcoinStatistics() {
  const [stats, setStats] = useState<BitcoinStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "bitcoin_statistics", "current_stats"),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setStats(docSnapshot.data() as BitcoinStats)
        } else {
          setError("No statistics data found")
        }
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching statistics:", err)
        setError("Failed to fetch Bitcoin statistics")
        setLoading(false)
      },
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
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

  // Update the BitcoinStatistics component to be more compact for the home page
  return (
    <section className="mb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-bitcoin-dark dark:text-white text-center md:text-left">
          Bitcoin Statistics
        </h2>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        <Tabs defaultValue="supply" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 sm:mb-6 bg-bitcoin-background dark:bg-gray-800 text-xs sm:text-sm">
            <TabsTrigger
              value="supply"
              className="flex items-center gap-2 data-[state=active]:bg-bitcoin data-[state=active]:text-white"
            >
              <Coins className="h-4 w-4" />
              <span className="hidden sm:inline">Supply</span>
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="flex items-center gap-2 data-[state=active]:bg-bitcoin data-[state=active]:text-white"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Market</span>
            </TabsTrigger>
            <TabsTrigger
              value="mining"
              className="flex items-center gap-2 data-[state=active]:bg-bitcoin data-[state=active]:text-white"
            >
              <Pickaxe className="h-4 w-4" />
              <span className="hidden sm:inline">Mining</span>
            </TabsTrigger>
            <TabsTrigger
              value="network"
              className="flex items-center gap-2 data-[state=active]:bg-bitcoin data-[state=active]:text-white"
            >
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
          </TabsList>

          {/* Supply Tab */}
          <TabsContent value="supply" className="space-y-4">
            <Card variant="bitcoin">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Bitcoin Supply</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Current circulation and total supply metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="dark:text-gray-300">Total Bitcoins Mined</span>
                    <span className="font-medium dark:text-white">
                      {formatNumber(stats?.percentage_of_total_bitcoins_mined || 0, 2)}%
                    </span>
                  </div>
                  <Progress variant="bitcoin" value={stats?.percentage_of_total_bitcoins_mined || 0} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">In Circulation</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.total_bitcoins_in_circulation || 0)} BTC
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Maximum Supply</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.total_bitcoins_to_ever_be_produced || 0)} BTC
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Left to Mine (Total)</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.total_bitcoins_left_to_mine || 0)} BTC
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Left Until Next Halving</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.total_bitcoins_left_to_mine_until_next_blockhalf || 0)} BTC
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Generated Per Day (Current)</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.bitcoins_generated_per_day || 0)} BTC
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Generated Per Day (After Halving)</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.bitcoins_generated_per_day_after_next_block_halving_event || 0)} BTC
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Tab */}
          <TabsContent value="market" className="space-y-4">
            <Card variant="bitcoin">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Market Information</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Price, market cap, and inflation metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Bitcoin Price</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatCurrency(stats?.bitcoin_price_usd || 0, 2)}
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Market Capitalization</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatCurrency(stats?.market_capitalization_usd || 0, 0)}
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Block Reward Value</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatCurrency(stats?.bitcoin_block_reward_usd || 0, 2)}
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Daily Inflation Value</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatCurrency(stats?.bitcoin_inflation_per_day_usd || 0, 0)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Annual Inflation Rate (Current)</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.bitcoin_inflation_rate_per_annum || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Annual Inflation Rate (After Halving)</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.bitcoin_inflation_rate_per_annum_after_next_block_halving_event || 0}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bitcoin-stat-card p-3 sm:p-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Inflation Until Next Halving (USD Value)</div>
                    <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                      {formatCurrency(
                        stats?.bitcoin_inflation_until_next_blockhalf_event_based_on_current_price_usd || 0,
                        0,
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mining Tab */}
          <TabsContent value="mining" className="space-y-4">
            <Card variant="bitcoin">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Mining Information</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Block rewards, difficulty, and halving metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Current Block Reward</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.current_block_reward || 0} BTC
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Next Block Reward (After Halving)</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.next_block_reward || 0} BTC
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Total Blocks Mined</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.total_blocks || 0, 0)}
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Blocks Until Halving</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.blocks_until_mining_reward_is_halved || 0, 0)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Total Halvings So Far</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.total_number_of_block_reward_halvings || 0}
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Hash Rate</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {formatNumber(stats?.hash_rate_exahashes_per_second || 0, 2)} EH/s
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Block Generation Time</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.approximate_block_generation_time_minutes || 0} minutes
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Blocks Per Day</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.approximate_blocks_generated_per_day || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bitcoin-stat-card p-3 sm:p-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Network Difficulty</div>
                    <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                      {formatNumber(stats?.difficulty || 0, 0)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-4">
            <Card variant="bitcoin">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl text-bitcoin-dark dark:text-white">Network Information</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Technical details about the Bitcoin network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Next Difficulty Retarget</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        Block {stats?.next_retarget_period_block_height || 0}
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Blocks Until Retarget</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.blocks_to_mine_until_next_difficulty_retarget || 0}
                      </div>
                    </div>

                    <div className="space-y-1 mt-4">
                      <div className="text-sm text-muted-foreground">Estimated Time Until Retarget</div>
                      <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                        {stats?.next_difficulty_retarget_eta || "Unknown"}
                      </div>
                    </div>
                  </div>

                  <div className="bitcoin-stat-card p-3 sm:p-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Activated Soft Forks</div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {stats?.current_activated_soft_forks.split(",").map((fork, index) => (
                          <span
                            key={index}
                            className="inline-block bg-bitcoin/20 text-bitcoin-dark dark:bg-bitcoin/10 dark:text-blue-300 px-2 py-1 rounded"
                          >
                            {fork.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {stats?.current_pending_soft_forks && (
                      <div className="space-y-1 mt-4">
                        <div className="text-sm text-muted-foreground">Pending Soft Forks</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {stats.current_pending_soft_forks ? (
                            stats.current_pending_soft_forks.split(",").map((fork, index) => (
                              <span
                                key={index}
                                className="inline-block bg-amber-500/20 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300 px-2 py-1 rounded"
                              >
                                {fork.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bitcoin-stat-card p-3 sm:p-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Estimated Halving Date</div>
                    <div className="text-sm sm:text-base md:text-xl font-bold text-bitcoin-dark dark:text-white">
                      {formatDate(stats?.estimated_halving_time || "")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

