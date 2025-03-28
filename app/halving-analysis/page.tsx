import { HalvingAnalysisTable } from "@/components/bitcoin/halving-analysis-table"

export const metadata = {
  title: "CoinWait - Bitcoin Halving Analysis",
  description: "Historical data and AI predictions for Bitcoin halving cycles",
}

export default function HalvingAnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-2 sm:p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-bitcoin-dark dark:text-white">
            Bitcoin Halving Analysis
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore historical Bitcoin halving data and AI-generated predictions for future market cycles. This analysis
            compares past performance with projected outcomes from leading AI models.
          </p>
        </div>
        <HalvingAnalysisTable />
      </div>
    </main>
  )
}

