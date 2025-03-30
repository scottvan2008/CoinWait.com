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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navigation() {
  const pathname = usePathname()

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
    {
      name: "Bitcoin Halving",
      href: "/bitcoin",
      icon: <Bitcoin className="h-5 w-5" />,
      active: pathname === "/bitcoin",
    },
  ]

  // Bitcoin Analysis dropdown items
  const bitcoinAnalysisItems = [
    {
      name: "Performance",
      href: "/monthly-returns",
      icon: <Calendar className="h-4 w-4" />,
      active: pathname === "/monthly-returns",
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

  // Tools dropdown items
  const toolsItems = [
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-4 w-4" />,
      active: pathname === "/calendar",
    },
    {
      name: "Fear & Greed",
      href: "/fear-greed",
      icon: <AlertCircle className="h-4 w-4" />,
      active: pathname === "/fear-greed",
    },
  ]

  // Check if any item in a dropdown is active
  const isAnalysisActive = bitcoinAnalysisItems.some((item) => item.active)
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

      {/* Bitcoin Analysis Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isAnalysisActive
                ? "bg-bitcoin text-white"
                : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
            )}
          >
            <BarChart3 className="h-5 w-5" />
            <span className="ml-2">Analysis</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {bitcoinAnalysisItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex w-full items-center px-2 py-1.5",
                  item.active && "bg-bitcoin/10 dark:bg-bitcoin/20",
                )}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Tools Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isToolsActive
                ? "bg-bitcoin text-white"
                : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
            )}
          >
            <LineChart className="h-5 w-5" />
            <span className="ml-2">Tools</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {toolsItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex w-full items-center px-2 py-1.5",
                  item.active && "bg-bitcoin/10 dark:bg-bitcoin/20",
                )}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}

