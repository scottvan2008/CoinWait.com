"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type {
    FearGreedData,
    FearGreedHistoricalData,
    FearGreedClassificationInfo,
} from "@/types/fear-greed";
import { formatDate } from "@/lib/formatters";
import { AlertCircle, Clock, Info } from "lucide-react";
import Image from "next/image";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea,
    Area,
    AreaChart,
} from "recharts";

export function FearGreedIndex() {
    const [fearGreedData, setFearGreedData] = useState<FearGreedData | null>(
        null
    );
    const [historicalData, setHistoricalData] =
        useState<FearGreedHistoricalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeFrame, setTimeFrame] = useState<string>("week");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Fetch current data
                const response = await fetch("https://api.alternative.me/fng/");
                const data = await response.json();
                setFearGreedData(data);

                // Fetch historical data
                // We'll fetch data for a few time periods
                const historicalResponse = await fetch(
                    "https://api.alternative.me/fng/?limit=30"
                );
                const historicalData = await historicalResponse.json();
                setHistoricalData(historicalData);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching Fear & Greed Index:", err);
                setError("Failed to fetch Fear & Greed Index data");
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Update the getFearGreedColor function to use the new colors
    const getFearGreedColor = (value: number): string => {
        if (value <= 25) return "text-pink-500 dark:text-pink-400"; // Extreme Fear - FA5A7D
        if (value <= 40) return "text-orange-500 dark:text-orange-400"; // Fear
        if (value <= 60) return "text-yellow-500 dark:text-yellow-400"; // Neutral
        if (value <= 75) return "text-lime-500 dark:text-lime-400"; // Greed
        return "text-green-500 dark:text-green-400"; // Extreme Greed - 3CD856
    };

    // Update the getFearGreedHexColor function to use the new colors
    const getFearGreedHexColor = (value: number): string => {
        if (value <= 25) return "#FA5A7D"; // Extreme Fear (pink)
        if (value <= 40) return "#FF9F45"; // Fear (orange)
        if (value <= 60) return "#FFD166"; // Neutral (yellow)
        if (value <= 75) return "#9BE36D"; // Greed (lime)
        return "#3CD856"; // Extreme Greed (green)
    };

    // Format Unix timestamp (seconds since epoch) to YYYY-MM-DD HH:MM:SS
    const formatUnixTimestamp = (unixTimestamp: string): string => {
        const date = new Date(Number.parseInt(unixTimestamp) * 1000);
        return formatDate(date.toISOString());
    };

    // Format time until update (seconds) to Xh Ym Zs format
    const formatTimeUntilUpdate = (seconds: string): string => {
        const totalSeconds = Number.parseInt(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;

        let result = "";
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0 || hours > 0) result += `${minutes}m `;
        result += `${remainingSeconds}s`;

        return result;
    };

    // Format Unix timestamp to YYYY-MM-DD for historical data
    const formatHistoricalDate = (unixTimestamp: string): string => {
        const date = new Date(Number.parseInt(unixTimestamp) * 1000);
        return date.toISOString().split("T")[0];
    };

    // Format date for chart tooltip and axis
    const formatChartDate = (unixTimestamp: string): string => {
        const date = new Date(Number.parseInt(unixTimestamp) * 1000);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Update the classificationInfo array to use the new colors
    const classificationInfo: FearGreedClassificationInfo[] = [
        {
            name: "Extreme Fear",
            description:
                "Investors are in extreme fear and prices may be oversold. This can be a buying opportunity.",
            color: "text-pink-500 dark:text-pink-400",
            range: [0, 25],
        },
        {
            name: "Fear",
            description:
                "Investors are fearful, which may indicate a market that is becoming nervous.",
            color: "text-orange-500 dark:text-orange-400",
            range: [26, 40],
        },
        {
            name: "Neutral",
            description:
                "Investors are neutral with no strong bias toward fear or greed.",
            color: "text-yellow-500 dark:text-yellow-400",
            range: [41, 60],
        },
        {
            name: "Greed",
            description:
                "Investors are becoming greedy, possibly indicating a market that is heating up.",
            color: "text-lime-500 dark:text-lime-400",
            range: [61, 75],
        },
        {
            name: "Extreme Greed",
            description:
                "Investors are extremely greedy and prices may be overvalued. This can be a selling opportunity.",
            color: "text-green-500 dark:text-green-400",
            range: [76, 100],
        },
    ];

    // Filter historical data based on selected time frame
    const getFilteredHistoricalData = () => {
        if (!historicalData?.data) return [];

        switch (timeFrame) {
            case "week":
                return historicalData.data.slice(0, 7);
            case "2week":
                return historicalData.data.slice(0, 14);
            case "month":
                return historicalData.data.slice(0, 30);
            default:
                return historicalData.data.slice(0, 7);
        }
    };

    // Format data for chart
    const getChartData = () => {
        const filteredData = getFilteredHistoricalData();
        // Reverse the data so it's in chronological order
        return [...filteredData].reverse().map((item) => ({
            date: formatChartDate(item.timestamp),
            fullDate: formatHistoricalDate(item.timestamp),
            value: Number.parseInt(item.value),
            timestamp: item.timestamp,
            classification: item.value_classification,
        }));
    };

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {data.fullDate}
                    </p>
                    <p
                        className={`text-lg font-bold ${getFearGreedColor(
                            data.value
                        )}`}
                    >
                        {data.value} - {data.classification}
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <Card variant="bitcoin" className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-10 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-8 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-4xl mx-auto border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-500 dark:text-red-400">
                        Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please check your connection and try again.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const currentTimestamp = fearGreedData?.data?.[0]?.timestamp
        ? formatUnixTimestamp(fearGreedData.data[0].timestamp)
        : "";
    const nextUpdateTime = fearGreedData?.data?.[0]?.time_until_update
        ? formatTimeUntilUpdate(fearGreedData.data[0].time_until_update)
        : "";

    return (
        <section className="mb-12">
            <Card variant="bitcoin" className="w-full max-w-4xl mx-auto">
                <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <CardTitle className="text-2xl md:text-3xl text-bitcoin-dark dark:text-white text-center mb-2 md:mb-0">
                            Crypto Fear & Greed Index
                        </CardTitle>
                        <div className="text-xs text-muted-foreground text-center md:text-right">
                            Last updated: {currentTimestamp}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Self-updating image from alternative.me */}
                    <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-bitcoin-background dark:bg-gray-800 rounded-lg">
                        <Image
                            src="https://alternative.me/crypto/fear-and-greed-index.png"
                            alt="Latest Crypto Fear & Greed Index"
                            width={500}
                            height={300}
                            className="rounded-lg shadow-md"
                        />

                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 text-bitcoin" />
                            <span>Next update in: {nextUpdateTime}</span>
                        </div>
                    </div>

                    {/* Historical Data */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-bitcoin-dark dark:text-white">
                            Historical Values
                        </h3>

                        <Tabs defaultValue="week" onValueChange={setTimeFrame}>
                            <TabsList className="grid grid-cols-3 mb-4 bg-bitcoin-background dark:bg-gray-800">
                                <TabsTrigger
                                    value="week"
                                    className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
                                >
                                    7 Days
                                </TabsTrigger>
                                <TabsTrigger
                                    value="2week"
                                    className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
                                >
                                    14 Days
                                </TabsTrigger>
                                <TabsTrigger
                                    value="month"
                                    className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
                                >
                                    30 Days
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value={timeFrame} className="mt-4">
                                <div className="bg-white dark:bg-gray-900 px-3 sm:px-4 py-2 sm:py-4 rounded-lg shadow-md border border-bitcoin/20 dark:border-bitcoin/10">
                                    <div className="h-[350px] sm:h-[400px] w-full">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart
                                                data={getChartData()}
                                                margin={{
                                                    top: 20,
                                                    right: 10,
                                                    left: 5,
                                                    bottom: 20,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="colorValue"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="5%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.8}
                                                        />
                                                        <stop
                                                            offset="95%"
                                                            stopColor="#3B82F6"
                                                            stopOpacity={0.1}
                                                        />
                                                    </linearGradient>
                                                    <filter
                                                        id="shadow"
                                                        height="200%"
                                                    >
                                                        <feDropShadow
                                                            dx="0"
                                                            dy="3"
                                                            stdDeviation="3"
                                                            floodOpacity="0.2"
                                                        />
                                                    </filter>
                                                </defs>

                                                {/* Reference areas with bitcoin-themed colors */}
                                                <ReferenceArea
                                                    y1={0}
                                                    y2={25}
                                                    fill="rgba(250, 90, 125, 0.05)"
                                                />
                                                <ReferenceArea
                                                    y1={25}
                                                    y2={40}
                                                    fill="rgba(255, 159, 69, 0.05)"
                                                />
                                                <ReferenceArea
                                                    y1={40}
                                                    y2={60}
                                                    fill="rgba(255, 209, 102, 0.05)"
                                                />
                                                <ReferenceArea
                                                    y1={60}
                                                    y2={75}
                                                    fill="rgba(155, 227, 109, 0.05)"
                                                />
                                                <ReferenceArea
                                                    y1={75}
                                                    y2={100}
                                                    fill="rgba(60, 216, 86, 0.05)"
                                                />

                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e5e7eb"
                                                    opacity={0.2}
                                                />
                                                <XAxis
                                                    dataKey="date"
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b",
                                                    }}
                                                    tickLine={{
                                                        stroke: "#94a3b8",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#94a3b8",
                                                    }}
                                                    tickMargin={10}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{
                                                        fontSize: 12,
                                                        fill: "#64748b",
                                                    }}
                                                    tickMargin={8}
                                                    width={35}
                                                    ticks={[
                                                        0, 10, 20, 30, 40, 50,
                                                        60, 70, 80, 90, 100,
                                                    ]}
                                                    tickLine={{
                                                        stroke: "#94a3b8",
                                                    }}
                                                    axisLine={{
                                                        stroke: "#94a3b8",
                                                    }}
                                                />
                                                <Tooltip
                                                    content={<CustomTooltip />}
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#3B82F6"
                                                    strokeWidth={3}
                                                    fillOpacity={0.8}
                                                    fill="url(#colorValue)"
                                                    isAnimationActive={true}
                                                    animationDuration={1000}
                                                    animationEasing="ease-in-out"
                                                    dot={(props) => {
                                                        const {
                                                            cx,
                                                            cy,
                                                            value,
                                                            index,
                                                        } = props;
                                                        return (
                                                            <circle
                                                                key={`dot-${index}`}
                                                                cx={cx}
                                                                cy={cy}
                                                                r={4}
                                                                stroke="white"
                                                                strokeWidth={2}
                                                                fill={getFearGreedHexColor(
                                                                    value
                                                                )}
                                                                style={{
                                                                    filter: "url(#shadow)",
                                                                }}
                                                            />
                                                        );
                                                    }}
                                                    activeDot={{
                                                        r: 8,
                                                        stroke: "white",
                                                        strokeWidth: 2,
                                                        fill: "#3B82F6",
                                                    }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Enhanced legend with bitcoin-themed styling */}
                                    <div className="flex flex-wrap justify-center gap-2 mt-6 px-2">
                                        {classificationInfo.map(
                                            (info, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center bg-bitcoin-background/50 dark:bg-gray-800/50 px-2 py-1 rounded-md border border-bitcoin/10 dark:border-bitcoin/5 transition-all hover:shadow-md"
                                                >
                                                    <div
                                                        className="w-3 h-3 rounded-full mr-1.5"
                                                        style={{
                                                            backgroundColor:
                                                                getFearGreedHexColor(
                                                                    (info
                                                                        .range[0] +
                                                                        info
                                                                            .range[1]) /
                                                                        2
                                                                ),
                                                        }}
                                                    />
                                                    <span
                                                        className={`text-xs font-medium ${info.color}`}
                                                    >
                                                        {info.name} (
                                                        {info.range[0]}-
                                                        {info.range[1]})
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* What is the Fear & Greed Index - Modern Redesign */}
                    <div className="mt-12">
                        <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
                            <div className="relative">
                                {/* Colorful top bar representing the fear-greed spectrum */}
                                <div className="h-2 w-full flex">
                                    <div className="w-1/5 bg-[#FA5A7D]"></div>
                                    <div className="w-1/5 bg-[#FF9F45]"></div>
                                    <div className="w-1/5 bg-[#FFD166]"></div>
                                    <div className="w-1/5 bg-[#9BE36D]"></div>
                                    <div className="w-1/5 bg-[#3CD856]"></div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="bg-gradient-to-br from-[#FA5A7D] to-[#3CD856] p-3 rounded-xl shadow-md">
                                            <Info className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                                What is the Fear & Greed Index?
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                                A tool that measures market
                                                sentiment from 0 (Extreme Fear)
                                                to 100 (Extreme Greed)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                                                <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FA5A7D]/10 text-[#FA5A7D] mr-2">
                                                        <AlertCircle className="h-5 w-5" />
                                                    </span>
                                                    How It Works
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                    The index analyzes emotions
                                                    and sentiments from
                                                    different sources including
                                                    price volatility, market
                                                    momentum, social media,
                                                    surveys, and trading volume
                                                    to generate a single number
                                                    representing the current
                                                    market sentiment.
                                                </p>
                                            </div>

                                            <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                                                <h4 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3CD856]/10 text-[#3CD856] mr-2">
                                                        <AlertCircle className="h-5 w-5" />
                                                    </span>
                                                    Why It Matters
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                                    Extreme fear can indicate
                                                    buying opportunities as
                                                    investors are too worried.
                                                    When investors get too
                                                    greedy, the market might be
                                                    due for a correction. The
                                                    index helps identify
                                                    potential market turning
                                                    points.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                Understanding the Scale
                                            </h4>

                                            <div className="relative h-12 bg-gradient-to-r from-[#FA5A7D] via-[#FFD166] to-[#3CD856] rounded-lg mb-4">
                                                {/* Scale markers */}
                                                <div className="absolute inset-0 flex justify-between px-2 items-center text-white font-bold text-xs">
                                                    <div>0</div>
                                                    <div>25</div>
                                                    <div>50</div>
                                                    <div>75</div>
                                                    <div>100</div>
                                                </div>

                                                {/* Scale labels */}
                                                <div className="absolute -bottom-8 inset-x-0 flex justify-between px-0">
                                                    <div className="text-[#FA5A7D] text-xs font-medium">
                                                        Extreme
                                                        <br />
                                                        Fear
                                                    </div>
                                                    <div className="text-[#FF9F45] text-xs font-medium">
                                                        Fear
                                                    </div>
                                                    <div className="text-[#FFD166] text-xs font-medium">
                                                        Neutral
                                                    </div>
                                                    <div className="text-[#9BE36D] text-xs font-medium">
                                                        Greed
                                                    </div>
                                                    <div className="text-[#3CD856] text-xs font-medium">
                                                        Extreme
                                                        <br />
                                                        Greed
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-12 pt-2 text-sm text-gray-500 dark:text-gray-400 flex items-start gap-2 border-t border-gray-200 dark:border-gray-700">
                                                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                                                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                                <p className="italic">
                                                    Remember: This index is not
                                                    financial advice. Always do
                                                    your own research before
                                                    making investment decisions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
}
