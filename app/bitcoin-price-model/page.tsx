import { Suspense } from "react"
import { BitcoinPriceModel } from "@/components/bitcoin/bitcoin-price-model"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata = {
  title: "CoinWait - Bitcoin Price Model",
  description: "Compare actual Bitcoin prices with the mathematical growth model based on days since genesis block",
}

// Loading fallback component
function ModelSkeleton() {
  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-64 mb-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-96 w-full" />
      </CardContent>
    </Card>
  )
}

export default function BitcoinPriceModelPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 sm:p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-bitcoin-dark dark:text-white">Bitcoin Price Model</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            This model compares actual Bitcoin prices with a mathematical growth model based on the number of days since
            the genesis block (January 4, 2009). The formula was developed by ahr999, a well-known Bitcoin analyst.
          </p>
        </div>
        <Suspense fallback={<ModelSkeleton />}>
          <BitcoinPriceModel />
        </Suspense>
      </div>
    </main>
  )
}

