import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Info,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calculator,
} from "lucide-react";

export function AHR999Explanation() {
    return (
        <Card className="w-full border-bitcoin/20 dark:border-bitcoin/10 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl text-bitcoin-dark dark:text-white flex items-center gap-2">
                    <Info className="h-5 w-5 text-bitcoin" />
                    Understanding the AHR999 Index
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="prose dark:prose-invert max-w-none">
                    <p>
                        The AHR999 Index is a Bitcoin valuation and investment
                        timing tool designed to guide long-term investors by
                        identifying optimal entry and exit points in the market.
                        Created by Weibo user ahr999 (later popularized in the
                        book "Bitcoin Accumulation" by "Nine God"), this index
                        combines historical price trends and market cycle
                        analysis to offer actionable insights.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-bitcoin-background/50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-bitcoin-dark dark:text-white flex items-center gap-2 mb-3">
                                <Calculator className="h-5 w-5 text-bitcoin" />
                                Core Components
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                The index is derived from two key metrics:
                            </p>
                            <ul className="mt-2 space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="bg-purple-100 dark:bg-purple-900/30 p-1 rounded-full mt-0.5">
                                        <DollarSign className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                    </span>
                                    <span>
                                        <strong>
                                            200-Day Geometric Mean Average
                                            (GMA200):
                                        </strong>{" "}
                                        A smoothed average of Bitcoin's price
                                        over 200 days, reflecting long-term
                                        investor cost bases.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mt-0.5">
                                        <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                    </span>
                                    <span>
                                        <strong>
                                            Logarithmic Growth Estimate:
                                        </strong>{" "}
                                        A valuation model based on Bitcoin's
                                        historical price trajectory since 2010,
                                        adjusted for its diminishing supply
                                        growth.
                                    </span>
                                </li>
                            </ul>
                            <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-center text-bitcoin-dark dark:text-white">
                                    The formula is expressed as:
                                </p>
                                <div className="text-center mt-2 text-sm">
                                    AHR999 Index = (Current Price / GMA200) ×
                                    (Current Price / Logarithmic Estimate)
                                </div>
                            </div>
                        </div>

                        <div className="bg-bitcoin-background/50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-bitcoin-dark dark:text-white flex items-center gap-2 mb-3">
                                <Info className="h-5 w-5 text-bitcoin" />
                                Interpretation and Usage
                            </h3>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                The index categorizes market phases into four
                                zones:
                            </p>
                            <ul className="mt-2 space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="bg-amber-100 dark:bg-amber-900/30 p-1 rounded-full mt-0.5">
                                        <TrendingDown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                    </span>
                                    <span>
                                        <strong className="text-amber-600 dark:text-amber-400">
                                            &lt;0.45:
                                        </strong>{" "}
                                        Marks an undervalued "bottom-fishing"
                                        territory, signaling high buying
                                        opportunities.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
                                        <DollarSign className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </span>
                                    <span>
                                        <strong className="text-blue-600 dark:text-blue-400">
                                            0.45–1.2:
                                        </strong>{" "}
                                        Suggests a "dollar-cost averaging (DCA)
                                        zone," ideal for gradual accumulation.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mt-0.5">
                                        <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                    </span>
                                    <span>
                                        <strong className="text-green-600 dark:text-green-400">
                                            &gt;1.2:
                                        </strong>{" "}
                                        Indicates a bull market, signaling price
                                        appreciation.
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="bg-red-100 dark:bg-red-900/30 p-1 rounded-full mt-0.5">
                                        <TrendingDown className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    </span>
                                    <span>
                                        <strong className="text-red-600 dark:text-red-400">
                                            &gt;4:
                                        </strong>{" "}
                                        A rare threshold indicating extreme
                                        overvaluation, prompting profit-taking.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg text-yellow-800 dark:text-yellow-300 text-sm">
                        <p className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5 flex-shrink-0"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                />
                            </svg>
                            <strong>Disclaimer:</strong> The AHR999 Index is a
                            tool for reference only and should not be considered
                            financial advice. Past performance does not
                            guarantee future results. Always do your own
                            research before making investment decisions.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
