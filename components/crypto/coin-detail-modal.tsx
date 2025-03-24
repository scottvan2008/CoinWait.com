"use client";
import { useEffect, useState } from "react";
import type React from "react";

import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowUpDown,
    Calendar,
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    Clock,
    DollarSign,
    Globe,
    Info,
    LineChart,
    TrendingUp,
} from "lucide-react";
import type { CryptoData } from "@/types/crypto";
import {
    formatCurrency,
    formatNumber,
    formatDate,
    formatShortDate,
    formatCryptoPrice,
} from "@/lib/formatters";
import { useIsMobile } from "@/hooks/use-mobile";

interface CoinDetailModalProps {
    coin: CryptoData | null;
    isOpen: boolean;
    onClose: () => void;
}

export function CoinDetailModal({
    coin,
    isOpen,
    onClose,
}: CoinDetailModalProps) {
    // Store scroll position when modal opens and handle browser history
    useEffect(() => {
        if (isOpen) {
            const scrollY = window.scrollY;

            // Push a new state to the history when the modal opens
            window.history.pushState({ modal: "coin-detail" }, "");

            // Event handler for the back button
            const handlePopState = () => {
                onClose();
            };

            // Add event listener for the back button
            window.addEventListener("popstate", handlePopState);

            // When modal closes, restore scroll position and clean up
            return () => {
                window.removeEventListener("popstate", handlePopState);
                setTimeout(() => {
                    window.scrollTo(0, scrollY);
                }, 0);
            };
        }
    }, [isOpen, onClose]);

    // Calculate the percentage between ATL and ATH where current price sits
    const calculatePricePosition = () => {
        if (!coin) return 0;
        const range = coin.ath - coin.atl;
        const position = coin.current_price - coin.atl;
        return (position / range) * 100;
    };

    const isMobile = useIsMobile();

    // Track touch events for swipe navigation
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    // Minimum swipe distance required (in px)
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        // Only handle swipes if they're significant enough
        if (isLeftSwipe || isRightSwipe) {
            const tabs = ["overview", "market", "details"];
            const currentIndex = tabs.indexOf(activeTab);

            if (isLeftSwipe && currentIndex < tabs.length - 1) {
                // Swipe left goes to next tab
                setActiveTab(tabs[currentIndex + 1]);
            } else if (isRightSwipe && currentIndex > 0) {
                // Swipe right goes to previous tab
                setActiveTab(tabs[currentIndex - 1]);
            }
        }

        // Reset touch positions
        setTouchStart(null);
        setTouchEnd(null);
    };

    if (!coin) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 w-[95vw] sm:w-auto">
                <DialogHeader
                    className={`flex ${
                        isMobile
                            ? "flex-col items-start"
                            : "flex-row items-center"
                    } gap-3`}
                >
                    <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 relative">
                        <Image
                            src={coin.image || "/placeholder.svg"}
                            alt={coin.name}
                            width={isMobile ? 40 : 48}
                            height={isMobile ? 40 : 48}
                            className="rounded-full"
                        />
                    </div>
                    <div>
                        <DialogTitle
                            className={`${
                                isMobile ? "text-xl" : "text-2xl"
                            } flex items-center flex-wrap gap-1 sm:gap-2`}
                        >
                            {coin.name}
                            <span className="text-xs sm:text-sm text-muted-foreground uppercase">
                                {coin.symbol}
                            </span>
                            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-bitcoin/10 text-bitcoin dark:bg-bitcoin/20 dark:text-blue-300 rounded-full">
                                Rank #{coin.market_cap_rank}
                            </span>
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                            Detailed market information and statistics
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="mt-4">
                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                    >
                        <TabsList className="grid grid-cols-3 mb-4 sm:mb-6 bg-bitcoin-background dark:bg-gray-800 text-xs sm:text-sm">
                            <TabsTrigger
                                value="overview"
                                className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
                            >
                                <LineChart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className={isMobile ? "text-xs" : ""}>
                                    Overview
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="market"
                                className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
                            >
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className={isMobile ? "text-xs" : ""}>
                                    Market
                                </span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="data-[state=active]:bg-bitcoin data-[state=active]:text-white"
                            >
                                <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                                <span className={isMobile ? "text-xs" : ""}>
                                    Details
                                </span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent
                            value="overview"
                            className="space-y-6"
                            onTouchStart={isMobile ? onTouchStart : undefined}
                            onTouchMove={isMobile ? onTouchMove : undefined}
                            onTouchEnd={isMobile ? onTouchEnd : undefined}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 sm:p-4 bg-bitcoin-background dark:bg-gray-800 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Current Price
                                    </div>
                                    <div className="text-3xl font-bold text-bitcoin-dark dark:text-white">
                                        {formatCryptoPrice(coin.current_price)}
                                    </div>
                                    <div
                                        className={`flex items-center text-sm mt-1 ${
                                            coin.price_change_percentage_24h > 0
                                                ? "text-green-600 dark:text-green-400"
                                                : coin.price_change_percentage_24h <
                                                  0
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-gray-500 dark:text-gray-400"
                                        }`}
                                    >
                                        {coin.price_change_percentage_24h >
                                        0 ? (
                                            <ChevronUp className="h-4 w-4 mr-1" />
                                        ) : coin.price_change_percentage_24h <
                                          0 ? (
                                            <ChevronDown className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ChevronsUpDown className="h-4 w-4 mr-1" />
                                        )}
                                        {Math.abs(
                                            coin.price_change_percentage_24h
                                        ).toFixed(2)}
                                        % (24h)
                                    </div>
                                </div>

                                <div className="p-3 sm:p-4 bg-bitcoin-background dark:bg-gray-800 rounded-lg">
                                    <div className="text-sm text-muted-foreground">
                                        Market Cap
                                    </div>
                                    <div className="text-xl font-bold text-bitcoin-dark dark:text-white">
                                        {formatCurrency(coin.market_cap, 0)}
                                    </div>
                                    <div
                                        className={`flex items-center text-sm mt-1 ${
                                            coin.market_cap_change_percentage_24h >
                                            0
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {coin.market_cap_change_percentage_24h >
                                        0 ? (
                                            <ChevronUp className="h-4 w-4 mr-1" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 mr-1" />
                                        )}
                                        {Math.abs(
                                            coin.market_cap_change_percentage_24h
                                        ).toFixed(2)}
                                        % (24h)
                                    </div>
                                </div>
                            </div>

                            {/* Price Range Indicator */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            Price Range (All Time)
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 p-4 bg-bitcoin-background dark:bg-gray-800 rounded-lg">
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <div>
                                            <div>All Time Low</div>
                                            <div className="font-medium text-sm text-bitcoin-dark dark:text-white">
                                                {formatCryptoPrice(coin.atl)}
                                            </div>
                                            <div className="text-xs">
                                                {formatShortDate(coin.atl_date)}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div>All Time High</div>
                                            <div className="font-medium text-sm text-bitcoin-dark dark:text-white">
                                                {formatCryptoPrice(coin.ath)}
                                            </div>
                                            <div className="text-xs">
                                                {formatShortDate(coin.ath_date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative mt-4">
                                        <Progress
                                            variant="bitcoin"
                                            value={calculatePricePosition()}
                                            className="h-2"
                                        />
                                        <div
                                            className="absolute top-0 h-4 w-4 bg-white dark:bg-blue-400 border-2 border-bitcoin rounded-full -mt-1"
                                            style={{
                                                left: `${calculatePricePosition()}%`,
                                                transform: "translateX(-50%)",
                                            }}
                                        />
                                    </div>
                                    <div className="mt-2 text-center">
                                        <div className="text-xs text-muted-foreground">
                                            Current:{" "}
                                            {formatCryptoPrice(
                                                coin.current_price
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {coin.ath_change_percentage > 0
                                                ? "+"
                                                : ""}
                                            {coin.ath_change_percentage.toFixed(
                                                2
                                            )}
                                            % from ATH
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Supply Information */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Circulating Supply
                                    </div>
                                    <div className="text-lg font-medium text-bitcoin-dark dark:text-white">
                                        {formatNumber(
                                            coin.circulating_supply,
                                            0
                                        )}{" "}
                                        {coin.symbol.toUpperCase()}
                                    </div>
                                    {coin.max_supply && (
                                        <div className="mt-2">
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>0</span>
                                                <span>
                                                    {formatNumber(
                                                        coin.max_supply,
                                                        0
                                                    )}
                                                </span>
                                            </div>
                                            <Progress
                                                variant="bitcoin"
                                                value={
                                                    (coin.circulating_supply /
                                                        coin.max_supply) *
                                                    100
                                                }
                                                className="h-1.5"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Total Supply
                                    </div>
                                    <div className="text-lg font-medium text-bitcoin-dark dark:text-white">
                                        {formatNumber(coin.total_supply, 0)}{" "}
                                        {coin.symbol.toUpperCase()}
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Max Supply
                                    </div>
                                    <div className="text-lg font-medium text-bitcoin-dark dark:text-white">
                                        {coin.max_supply
                                            ? formatNumber(coin.max_supply, 0)
                                            : "∞"}{" "}
                                        {coin.symbol.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Market Data Tab */}
                        <TabsContent
                            value="market"
                            className="space-y-4"
                            onTouchStart={isMobile ? onTouchStart : undefined}
                            onTouchMove={isMobile ? onTouchMove : undefined}
                            onTouchEnd={isMobile ? onTouchEnd : undefined}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Market Cap Rank
                                    </div>
                                    <div className="text-xl font-medium text-bitcoin-dark dark:text-white">
                                        #{coin.market_cap_rank}
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Market Cap
                                    </div>
                                    <div className="text-xl font-medium text-bitcoin-dark dark:text-white">
                                        {formatCurrency(coin.market_cap, 0)}
                                    </div>
                                    <div
                                        className={`flex items-center text-xs mt-1 ${
                                            coin.market_cap_change_percentage_24h >
                                            0
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {coin.market_cap_change_percentage_24h >
                                        0 ? (
                                            <ChevronUp className="h-3 w-3 mr-1" />
                                        ) : (
                                            <ChevronDown className="h-3 w-3 mr-1" />
                                        )}
                                        {formatCurrency(
                                            Math.abs(
                                                coin.market_cap_change_24h
                                            ),
                                            0
                                        )}{" "}
                                        (
                                        {Math.abs(
                                            coin.market_cap_change_percentage_24h
                                        ).toFixed(2)}
                                        %) (24h)
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Trading Volume (24h)
                                    </div>
                                    <div className="text-xl font-medium text-bitcoin-dark dark:text-white">
                                        {formatCurrency(coin.total_volume, 0)}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {(
                                            (coin.total_volume /
                                                coin.market_cap) *
                                            100
                                        ).toFixed(2)}
                                        % of market cap
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Fully Diluted Valuation
                                    </div>
                                    <div className="text-xl font-medium text-bitcoin-dark dark:text-white">
                                        {coin.fully_diluted_valuation
                                            ? formatCurrency(
                                                  coin.fully_diluted_valuation,
                                                  0
                                              )
                                            : "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Price Change Percentages */}
                            <div className="bitcoin-stat-card">
                                <div className="text-sm text-muted-foreground mb-2">
                                    Price Change
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[
                                        {
                                            label: "1 Hour",
                                            value: coin.price_change_percentage_1h_in_currency,
                                        },
                                        {
                                            label: "24 Hours",
                                            value: coin.price_change_percentage_24h,
                                        },
                                        {
                                            label: "7 Days",
                                            value: coin.price_change_percentage_7d_in_currency,
                                        },
                                        {
                                            label: "14 Days",
                                            value: coin.price_change_percentage_14d_in_currency,
                                        },
                                        {
                                            label: "30 Days",
                                            value: coin.price_change_percentage_30d_in_currency,
                                        },
                                        {
                                            label: "1 Year",
                                            value: coin.price_change_percentage_1y_in_currency,
                                        },
                                    ].map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col"
                                        >
                                            <span className="text-xs text-muted-foreground">
                                                {item.label}
                                            </span>
                                            {item.value !== undefined ? (
                                                <span
                                                    className={`text-sm font-medium ${
                                                        item.value > 0
                                                            ? "text-green-600 dark:text-green-400"
                                                            : item.value < 0
                                                            ? "text-red-600 dark:text-red-400"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {item.value > 0 ? "+" : ""}
                                                    {item.value.toFixed(2)}%
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-500">
                                                    N/A
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        Price Change (24h)
                                    </div>
                                    <div
                                        className={`text-xl font-medium ${
                                            coin.price_change_24h > 0
                                                ? "text-green-600 dark:text-green-400"
                                                : coin.price_change_24h < 0
                                                ? "text-red-600 dark:text-red-400"
                                                : "text-bitcoin-dark dark:text-white"
                                        }`}
                                    >
                                        {coin.price_change_24h > 0 ? "+" : ""}
                                        {formatCurrency(coin.price_change_24h)}(
                                        {coin.price_change_percentage_24h > 0
                                            ? "+"
                                            : ""}
                                        {coin.price_change_percentage_24h.toFixed(
                                            2
                                        )}
                                        %)
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        24h Range
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1">
                                        Low: {formatCryptoPrice(coin.low_24h)}
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1">
                                        High: {formatCryptoPrice(coin.high_24h)}
                                    </div>
                                </div>
                            </div>

                            {coin.roi && (
                                <div className="bitcoin-stat-card">
                                    <div className="text-sm text-muted-foreground">
                                        ROI
                                    </div>
                                    <div
                                        className={`text-xl font-medium ${
                                            coin.roi.percentage > 0
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {coin.roi.percentage > 0 ? "+" : ""}
                                        {coin.roi.percentage.toFixed(2)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        Currency:{" "}
                                        {coin.roi.currency.toUpperCase()}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Details Tab */}
                        <TabsContent
                            value="details"
                            className="space-y-4"
                            onTouchStart={isMobile ? onTouchStart : undefined}
                            onTouchMove={isMobile ? onTouchMove : undefined}
                            onTouchEnd={isMobile ? onTouchEnd : undefined}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bitcoin-stat-card">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm text-muted-foreground">
                                            All Time Low Date
                                        </div>
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1">
                                        {formatShortDate(coin.atl_date)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatDate(coin.atl_date)}
                                    </div>
                                    <div className="text-sm font-medium mt-1">
                                        Price: {formatCryptoPrice(coin.atl)}
                                    </div>
                                    <div className="text-xs text-green-600 dark:text-green-400">
                                        +{coin.atl_change_percentage.toFixed(2)}
                                        % from ATL
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm text-muted-foreground">
                                            All Time High Date
                                        </div>
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1">
                                        {formatShortDate(coin.ath_date)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {formatDate(coin.ath_date)}
                                    </div>
                                    <div className="text-sm font-medium mt-1">
                                        Price: {formatCryptoPrice(coin.ath)}
                                    </div>
                                    <div
                                        className={`text-xs ${
                                            coin.ath_change_percentage > 0
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {coin.ath_change_percentage > 0
                                            ? "+"
                                            : ""}
                                        {coin.ath_change_percentage.toFixed(2)}%
                                        from ATH
                                    </div>
                                </div>
                            </div>

                            <div className="bitcoin-stat-card">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div className="text-sm text-muted-foreground">
                                        Last Updated
                                    </div>
                                </div>
                                <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1">
                                    {formatDate(coin.last_updated)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bitcoin-stat-card">
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm text-muted-foreground">
                                            ID
                                        </div>
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1 break-all">
                                        {coin.id}
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm text-muted-foreground">
                                            Symbol
                                        </div>
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1 uppercase">
                                        {coin.symbol}
                                    </div>
                                </div>
                                <div className="bitcoin-stat-card">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4 text-muted-foreground" />
                                        <div className="text-sm text-muted-foreground">
                                            Name
                                        </div>
                                    </div>
                                    <div className="text-base font-medium text-bitcoin-dark dark:text-white mt-1">
                                        {coin.name}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
