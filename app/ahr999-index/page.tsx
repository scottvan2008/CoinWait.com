import { Suspense } from "react"
import { AHR999Index } from "@/components/bitcoin/ahr999-index"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export const metadata = {
  title: "CoinWait - AHR999 Index",
  description: "Track the AHR999 Index to identify optimal Bitcoin entry and exit points",
}

// Loading fallback component
function IndexSkeleton() {
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

export default function AHR999IndexPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 sm:p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-bitcoin-dark dark:text-white">AHR999 Index</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            A Bitcoin valuation and investment timing tool designed to identify optimal entry and exit points in the
            market.
          </p>
        </div>
        <Suspense fallback={<IndexSkeleton />}>
          <AHR999Index />
        </Suspense>
      </div>
    </main>
  )
}

