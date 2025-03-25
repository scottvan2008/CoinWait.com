"use client"

import type React from "react"

import { useState } from "react"
import { Search, X, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { FilterOptions } from "@/types/exchange"
import { useIsMobile } from "@/hooks/use-mobile"

interface ExchangeFiltersProps {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  availableCountries: string[]
  availableYears: number[]
}

export function ExchangeFilters({ filters, setFilters, availableCountries, availableYears }: ExchangeFiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const isMobile = useIsMobile()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value })
  }

  const handleTrustScoreChange = (value: number[]) => {
    setFilters({ ...filters, minTrustScore: value[0] })
  }

  const handleCountryChange = (value: string) => {
    setFilters({ ...filters, country: value === "all" ? null : value })
  }

  const handleYearChange = (value: string) => {
    setFilters({
      ...filters,
      yearEstablished: value === "all" ? null : Number.parseInt(value),
    })
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      minTrustScore: 0,
      country: null,
      yearEstablished: null,
    })
  }

  const hasActiveFilters =
    filters.search !== "" || filters.minTrustScore > 0 || filters.country !== null || filters.yearEstablished !== null

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exchanges..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="bitcoin" size="sm" onClick={() => setExpanded(!expanded)} className="sm:w-auto w-full">
            <Filter className="h-4 w-4 mr-2" />
            {isMobile ? "Filters" : expanded ? "Hide Filters" : "Show Filters"}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="sm:w-auto">
              <X className="h-4 w-4 mr-2" />
              {isMobile ? "Clear" : "Clear Filters"}
            </Button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-bitcoin-background dark:bg-gray-800 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium">Min Trust Score: {filters.minTrustScore}</label>
            <Slider
              value={[filters.minTrustScore]}
              min={0}
              max={10}
              step={1}
              onValueChange={handleTrustScoreChange}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <Select value={filters.country || "all"} onValueChange={handleCountryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {availableCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year Established</label>
            <Select value={filters.yearEstablished?.toString() || "all"} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}

