"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import type {
    Exchange,
    ExchangeData,
    FilterOptions,
    SortDirection,
    SortField,
} from "@/types/exchange";
import { ExchangeTable } from "./exchange-table";
import { ExchangeFilters } from "./exchange-filters";
import { formatDate } from "@/lib/formatters";

export function ExchangeList() {
    const [exchangeData, setExchangeData] = useState<ExchangeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Sorting state
    const [sortField, setSortField] = useState<SortField>("trust_score_rank");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Filtering state
    const [filters, setFilters] = useState<FilterOptions>({
        search: "",
        minTrustScore: 0,
        country: null,
        yearEstablished: null,
    });

    // Filtered and sorted exchanges
    const [displayedExchanges, setDisplayedExchanges] = useState<Exchange[]>(
        []
    );

    // Available countries for filter dropdown
    const [availableCountries, setAvailableCountries] = useState<string[]>([]);
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    // Subscribe to real-time updates from Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, "exchange_data", "top_100_exchanges"),
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as ExchangeData;
                    setExchangeData(data);

                    // Extract unique countries and years for filters
                    if (data.exchanges) {
                        const countries = Array.from(
                            new Set(
                                data.exchanges
                                    .filter((exchange) => exchange.country)
                                    .map(
                                        (exchange) => exchange.country as string
                                    )
                            )
                        ).sort();

                        const years = Array.from(
                            new Set(
                                data.exchanges
                                    .filter(
                                        (exchange) => exchange.year_established
                                    )
                                    .map(
                                        (exchange) =>
                                            exchange.year_established as number
                                    )
                            )
                        ).sort((a, b) => b - a); // Sort years in descending order

                        setAvailableCountries(countries);
                        setAvailableYears(years);
                    }
                } else {
                    setError("No exchange data found");
                }
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching exchange data:", err);
                setError("Failed to fetch cryptocurrency exchange data");
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Apply filters and sorting
    useEffect(() => {
        if (!exchangeData?.exchanges) return;

        let filtered = [...exchangeData.exchanges];

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(
                (exchange) =>
                    exchange.name.toLowerCase().includes(searchTerm) ||
                    exchange.id.toLowerCase().includes(searchTerm) ||
                    (exchange.country &&
                        exchange.country.toLowerCase().includes(searchTerm))
            );
        }

        // Apply trust score filter
        if (filters.minTrustScore > 0) {
            filtered = filtered.filter(
                (exchange) => exchange.trust_score >= filters.minTrustScore
            );
        }

        // Apply country filter
        if (filters.country) {
            filtered = filtered.filter(
                (exchange) => exchange.country === filters.country
            );
        }

        // Apply year established filter
        if (filters.yearEstablished) {
            filtered = filtered.filter(
                (exchange) =>
                    exchange.year_established === filters.yearEstablished
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            // Handle null values
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return sortDirection === "asc" ? 1 : -1;
            if (bValue === null) return sortDirection === "asc" ? -1 : 1;

            // Special case for string comparison
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortDirection === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // Numeric comparison
            return sortDirection === "asc"
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        });

        setDisplayedExchanges(filtered);
        // Reset to first page when filters change
        setCurrentPage(1);
    }, [exchangeData, filters, sortField, sortDirection]);

    // Calculate pagination
    const totalPages = Math.ceil(
        (displayedExchanges?.length || 0) / itemsPerPage
    );
    const paginatedExchanges = displayedExchanges.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            // Toggle direction if same field
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Set new field and default to ascending
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of the table
        document
            .getElementById("exchange-table-top")
            ?.scrollIntoView({ behavior: "smooth" });
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    if (loading) {
        return (
            <Card variant="bitcoin" className="w-full mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-64 mb-4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full mb-4" />
                    <Skeleton className="h-96 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full max-w-7xl mx-auto border-red-200 dark:border-red-900">
                <CardHeader>
                    <CardTitle className="text-red-500 dark:text-red-400">
                        Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{error}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Please check your Firestore configuration and try again.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="bitcoin" className="w-full mx-auto">
            <CardHeader className="pb-2 px-3 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
                    {exchangeData && (
                        <div className="text-xs text-muted-foreground">
                            Last updated:{" "}
                            {formatDate(exchangeData.last_updated)}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
                <ExchangeFilters
                    filters={filters}
                    setFilters={setFilters}
                    availableCountries={availableCountries}
                    availableYears={availableYears}
                />

                <div id="exchange-table-top" className="mt-4 sm:mt-6">
                    <ExchangeTable
                        exchanges={paginatedExchanges}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        itemsPerPage={itemsPerPage}
                        onItemsPerPageChange={handleItemsPerPageChange}
                        totalItems={displayedExchanges.length}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
