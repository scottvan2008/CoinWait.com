"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Info, TrendingUp, TrendingDown, Calendar, DollarSign, Brain, History } from "lucide-react"
import { formatCurrency } from "@/lib/formatters"

// Historical halving data
const historicalData = [
  {
    event: "1st Halving",
    halvingDate: "2012-11-28",
    priceAtHalving: 12.38,
    athDateAfterHalving: "2013-12-04",
    athPriceAfterHalving: 1151.17,
    daysFromHalvingToAth: 371,
    lowestTimeAfterAth: "2015-01-14",
    lowestPriceAfterAth: 178.1,
    drawdownFromAth: 84.53,
    daysFromAthToLowest: 406,
  },
  {
    event: "2nd Halving",
    halvingDate: "2016-07-09",
    priceAtHalving: 650.96,
    athDateAfterHalving: "2017-12-16",
    athPriceAfterHalving: 19497.4,
    daysFromHalvingToAth: 525,
    lowestTimeAfterAth: "2018-12-15",
    lowestPriceAfterAth: 3236.76,
    drawdownFromAth: 83.4,
    daysFromAthToLowest: 364,
  },
  {
    event: "3rd Halving",
    halvingDate: "2020-05-11",
    priceAtHalving: 8601.8,
    athDateAfterHalving: "2021-11-08",
    athPriceAfterHalving: 67566.83,
    daysFromHalvingToAth: 546,
    lowestTimeAfterAth: "2022-11-21",
    lowestPriceAfterAth: 15787.28,
    drawdownFromAth: 76.63,
    daysFromAthToLowest: 378,
  },
]

// AI prediction data
const aiPredictions = [
  {
    model: "DeepSeek",
    athDateAfterHalving: "2025-10-29",
    athPriceAfterHalving: 195000,
    daysFromHalvingToAth: 557,
    lowestTimeAfterAth: "2026-11-12",
    lowestPriceAfterAth: 48750,
    drawdownFromAth: 75,
    daysFromAthToLowest: 380,
  },
  {
    model: "ChatGPT",
    athDateAfterHalving: "2025-10-17",
    athPriceAfterHalving: 195000,
    daysFromHalvingToAth: 546,
    lowestTimeAfterAth: "2026-10-31",
    lowestPriceAfterAth: 58500,
    drawdownFromAth: 70,
    daysFromAthToLowest: 380,
  },
  {
    model: "Grok",
    athDateAfterHalving: "2025-10-22",
    athPriceAfterHalving: 134000,
    daysFromHalvingToAth: 550,
    lowestTimeAfterAth: "2026-10-27",
    lowestPriceAfterAth: 40200,
    drawdownFromAth: 70,
    daysFromAthToLowest: 370,
  },
]

// Fourth halving data
const fourthHalvingData = {
  event: "4th Halving",
  halvingDate: "2024-04-20",
  priceAtHalving: 64994.44,
}

export function HalvingAnalysisTable() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768)

  // Replace the current window resize listener with this useEffect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="space-y-8">
      {/* Historical Data Section */}
      <Card className="w-full overflow-hidden border-blue-100 dark:border-blue-900/30 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-b border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-xl text-blue-800 dark:text-blue-300">Historical Halving Cycles</CardTitle>
          </div>
          <CardDescription className="text-blue-700/70 dark:text-blue-400/70">
            Analysis of Bitcoin's price performance during previous halving cycles
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0 flex justify-center">
            <table className="w-full max-w-2xl border-collapse table-fixed sm:table-auto">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/20">
                  <th className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-left font-medium text-blue-800 dark:text-blue-300 text-xs sm:text-sm">
                    BTC
                  </th>
                  {historicalData.map((data) => (
                    <th
                      key={data.event}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center font-medium text-blue-800 dark:text-blue-300 text-xs sm:text-sm"
                    >
                      {data.event}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm">Halving Date</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-date`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {data.halvingDate}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm">Price at Halving</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-price`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {formatCurrency(data.priceAtHalving)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-green-500" />
                      <span className="text-xs sm:text-sm">ATH Date After Halving</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-ath-date`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {data.athDateAfterHalving}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-green-500" />
                      <span className="text-xs sm:text-sm">ATH Price After Halving</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-ath-price`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm"
                    >
                      {formatCurrency(data.athPriceAfterHalving)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm">Days from Halving to ATH</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-days-to-ath`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center font-medium text-xs sm:text-sm"
                    >
                      {data.daysFromHalvingToAth}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-xs sm:text-sm">Lowest Point Date After ATH</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-lowest-date`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {data.lowestTimeAfterAth}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-xs sm:text-sm">Lowest Price After ATH</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-lowest-price`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {formatCurrency(data.lowestPriceAfterAth)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-xs sm:text-sm">Drawdown from ATH</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-drawdown`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm"
                    >
                      {data.drawdownFromAth}%
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                  <td className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 bg-blue-50/80 dark:bg-blue-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm">Days from ATH to Lowest</span>
                    </div>
                  </td>
                  {historicalData.map((data) => (
                    <td
                      key={`${data.event}-days-to-lowest`}
                      className="border border-blue-100 dark:border-blue-800/50 p-1 sm:p-2 text-center font-medium text-xs sm:text-sm"
                    >
                      {data.daysFromAthToLowest}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Simple spacer between sections */}
      <div className="my-8"></div>

      {/* AI Predictions Section */}
      <Card className="w-full overflow-hidden border-amber-100 dark:border-amber-900/30 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 border-b border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
              <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-xl text-amber-800 dark:text-amber-300">AI Predictions for 4th Halving</CardTitle>
          </div>
          <CardDescription className="text-amber-700/70 dark:text-amber-400/70">
            AI model predictions for the current halving cycle (2024-2028)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 p-2 sm:p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-300 font-medium">4th Halving Date:</span>
              <span className="text-amber-700 dark:text-amber-400">{fourthHalvingData.halvingDate}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-800 dark:text-amber-300 font-medium">Price at Halving:</span>
              <span className="text-amber-700 dark:text-amber-400">
                {formatCurrency(fourthHalvingData.priceAtHalving)}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0 flex justify-center">
            <table className="w-full max-w-2xl border-collapse table-fixed sm:table-auto">
              <thead>
                <tr className="bg-amber-50 dark:bg-amber-900/20">
                  <th className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-left font-medium text-amber-800 dark:text-amber-300 text-xs sm:text-sm">
                    AI Models
                  </th>
                  {aiPredictions.map((prediction) => (
                    <th
                      key={prediction.model}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center font-medium text-amber-800 dark:text-amber-300 text-xs sm:text-sm"
                    >
                      {prediction.model}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-green-500" />
                      <span className="text-xs sm:text-sm">Predicted ATH Date</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-ath-date`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {prediction.athDateAfterHalving}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-green-500" />
                      <span className="text-xs sm:text-sm">Predicted ATH Price</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-ath-price`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center text-green-600 dark:text-green-400 font-semibold text-xs sm:text-sm"
                    >
                      {formatCurrency(prediction.athPriceAfterHalving)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs sm:text-sm">Days from Halving to ATH</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-days-to-ath`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center font-medium text-xs sm:text-sm"
                    >
                      {prediction.daysFromHalvingToAth}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-xs sm:text-sm">Predicted Lowest Point Date</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-lowest-date`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {prediction.lowestTimeAfterAth}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-xs sm:text-sm">Predicted Lowest Price</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-lowest-price`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center text-xs sm:text-sm"
                    >
                      {formatCurrency(prediction.lowestPriceAfterAth)}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-red-500" />
                      <span className="text-xs sm:text-sm">Predicted Drawdown from ATH</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-drawdown`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center text-red-600 dark:text-red-400 font-medium text-xs sm:text-sm"
                    >
                      {prediction.drawdownFromAth}%
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                  <td className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 bg-amber-50/80 dark:bg-amber-900/30 font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs sm:text-sm">Days from ATH to Lowest</span>
                    </div>
                  </td>
                  {aiPredictions.map((prediction) => (
                    <td
                      key={`${prediction.model}-days-to-lowest`}
                      className="border border-amber-100 dark:border-amber-800/50 p-1 sm:p-2 text-center font-medium text-xs sm:text-sm"
                    >
                      {prediction.daysFromAthToLowest}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50/80 to-amber-50/80 dark:from-blue-950/30 dark:to-amber-950/30 rounded-xl shadow-md border border-blue-100/50 dark:border-blue-900/20 text-sm text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-amber-100 dark:from-blue-900/30 dark:to-amber-900/30 rounded-full shadow-sm">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Understanding the Analysis</h3>
            <p className="mb-3">
              This analysis compares historical Bitcoin halving cycles with AI-generated predictions for the current
              cycle:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start gap-2">
                <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded-full mt-0.5">
                  <History className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span>
                  <strong className="text-blue-700 dark:text-blue-400">Historical Data:</strong> Shows actual price
                  performance during the first three Bitcoin halving cycles.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded-full mt-0.5">
                  <Brain className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span>
                  <strong className="text-amber-700 dark:text-amber-400">AI Predictions:</strong> Forecasts from three
                  leading AI models for the fourth halving cycle (2024-2028).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-0.5">
                  <TrendingUp className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                </div>
                <span>
                  <strong>Key Metrics:</strong> All-time high prices, drawdowns, and the number of days between
                  significant events.
                </span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-lg">
              <p className="text-xs italic text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  />
                </svg>
                Note: AI predictions are speculative and should not be considered financial advice. Past performance
                does not guarantee future results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

