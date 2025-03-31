"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bitcoin,
  LineChart,
  Building,
  AlertCircle,
  Calendar,
  TrendingUp,
  BarChart3,
  ChevronDown,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { EthereumIcon } from "@/components/icons/ethereum-icon"

export function Navigation() {
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Main navigation items
  const mainNavItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      name: "Exchanges",
      href: "/exchanges",
      icon: <Building className="h-5 w-5" />,
      active: pathname === "/exchanges",
    },
  ]

  // Bitcoin dropdown items
  const bitcoinItems = [
    {
      name: "Halving",
      href: "/bitcoin",
      icon: <Bitcoin className="h-4 w-4" />,
      active: pathname === "/bitcoin",
    },
    {
      name: "Performance",
      href: "/monthly-returns",
      icon: <Calendar className="h-4 w-4" />,
      active: pathname === "/monthly-returns",
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-4 w-4" />,
      active: pathname === "/calendar",
    },
    {
      name: "Halving Analysis",
      href: "/halving-analysis",
      icon: <TrendingUp className="h-4 w-4" />,
      active: pathname === "/halving-analysis",
    },
    {
      name: "Price Model",
      href: "/bitcoin-price-model",
      icon: <LineChart className="h-4 w-4" />,
      active: pathname === "/bitcoin-price-model",
    },
    {
      name: "AHR999 Index",
      href: "/ahr999-index",
      icon: <BarChart3 className="h-4 w-4" />,
      active: pathname === "/ahr999-index",
    },
  ]

  // Ethereum dropdown items
  const ethereumItems = [
    {
      name: "Performance",
      href: "/ethereum",
      icon: <LineChart className="h-4 w-4" />,
      active: pathname === "/ethereum",
    },
    {
      name: "Calendar",
      href: "/ethereum-calendar",
      icon: <Calendar className="h-4 w-4" />,
      active: pathname === "/ethereum-calendar",
    },
  ]

  // Tools dropdown items
  const toolsItems = [
    {
      name: "Fear & Greed",
      href: "/fear-greed",
      icon: <AlertCircle className="h-4 w-4" />,
      active: pathname === "/fear-greed",
    },
  ]

  // Check if any item in a dropdown is active
  const isBitcoinActive = bitcoinItems.some((item) => item.active)
  const isEthereumActive = ethereumItems.some((item) => item.active)
  const isToolsActive = toolsItems.some((item) => item.active)

  return (
    <nav className="flex items-center space-x-1">
      {mainNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            item.active
              ? "bg-bitcoin text-white"
              : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
          )}
        >
          {item.icon}
          <span className="ml-2">{item.name}</span>
        </Link>
      ))}

      {/* Bitcoin Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setActiveDropdown("bitcoin")}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            isBitcoinActive || activeDropdown === "bitcoin"
              ? "bg-bitcoin text-white"
              : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
          )}
        >
          <Bitcoin className="h-5 w-5" />
          <span className="ml-2">BTC</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        {activeDropdown === "bitcoin" && (
          <div className="absolute right-0 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
            <div className="py-1">
              {bitcoinItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center px-4 py-2 text-sm",
                    item.active
                      ? "bg-bitcoin/10 dark:bg-bitcoin/20 text-bitcoin-dark dark:text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ethereum Dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setActiveDropdown("ethereum")}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            isEthereumActive || activeDropdown === "ethereum"
              ? "bg-bitcoin text-white"
              : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
          )}
        >
          <EthereumIcon className="h-5 w-5" />
          <span className="ml-2">ETH</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </button>
        {activeDropdown === "ethereum" && (
          <div className="absolute right-0 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
            <div className="py-1">
              {ethereumItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center px-4 py-2 text-sm",
                    item.active
                      ? "bg-bitcoin/10 dark:bg-bitcoin/20 text-bitcoin-dark dark:text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                  )}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tools Dropdown */}
      {toolsItems.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setActiveDropdown("tools")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isToolsActive || activeDropdown === "tools"
                ? "bg-bitcoin text-white"
                : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
            )}
          >
            <LineChart className="h-5 w-5" />
            <span className="ml-2">Tools</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {activeDropdown === "tools" && (
            <div className="absolute right-0 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 z-50">
              <div className="py-1">
                {toolsItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex w-full items-center px-4 py-2 text-sm",
                      item.active
                        ? "bg-bitcoin/10 dark:bg-bitcoin/20 text-bitcoin-dark dark:text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

