"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  Bitcoin,
  LineChart,
  Building,
  AlertCircle,
  Calendar,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  // Main navigation items
  const mainNavItems = [
    {
      name: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 mr-2" />,
      active: pathname === "/",
    },
    {
      name: "Exchanges",
      href: "/exchanges",
      icon: <Building className="h-5 w-5 mr-2" />,
      active: pathname === "/exchanges",
    },
    {
      name: "Bitcoin Halving",
      href: "/bitcoin",
      icon: <Bitcoin className="h-5 w-5 mr-2" />,
      active: pathname === "/bitcoin",
    },
  ]

  // Bitcoin Analysis dropdown items
  const bitcoinAnalysisItems = [
    {
      name: "Performance",
      href: "/monthly-returns",
      icon: <Calendar className="h-5 w-5 mr-2" />,
      active: pathname === "/monthly-returns",
    },
    {
      name: "Halving Analysis",
      href: "/halving-analysis",
      icon: <TrendingUp className="h-5 w-5 mr-2" />,
      active: pathname === "/halving-analysis",
    },
    {
      name: "Price Model",
      href: "/bitcoin-price-model",
      icon: <LineChart className="h-5 w-5 mr-2" />,
      active: pathname === "/bitcoin-price-model",
    },
    {
      name: "AHR999 Index",
      href: "/ahr999-index",
      icon: <BarChart3 className="h-5 w-5 mr-2" />,
      active: pathname === "/ahr999-index",
    },
  ]

  // Tools dropdown items
  const toolsItems = [
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5 mr-2" />,
      active: pathname === "/calendar",
    },
    {
      name: "Fear & Greed",
      href: "/fear-greed",
      icon: <AlertCircle className="h-5 w-5 mr-2" />,
      active: pathname === "/fear-greed",
    },
  ]

  // Check if any item in a dropdown is active
  const isAnalysisActive = bitcoinAnalysisItems.some((item) => item.active)
  const isToolsActive = toolsItems.some((item) => item.active)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]" hideCloseButton>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <div className="relative h-8 w-8 overflow-hidden rounded-md">
                <Image src="/logo.png" alt="CoinWait Logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="font-bold text-xl">CoinWait</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="flex flex-col gap-2">
            {/* Main Navigation Items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                  item.active
                    ? "bg-bitcoin text-white"
                    : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}

            {/* Bitcoin Analysis Section */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection("analysis")}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md transition-colors",
                  isAnalysisActive
                    ? "bg-bitcoin text-white"
                    : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
                )}
              >
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Analysis
                </div>
                {expandedSection === "analysis" ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>

              {expandedSection === "analysis" && (
                <div className="ml-4 mt-1 space-y-1">
                  {bitcoinAnalysisItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        item.active
                          ? "bg-bitcoin/20 text-bitcoin dark:text-bitcoin-light"
                          : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-300 dark:hover:bg-bitcoin/10",
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Tools Section */}
            <div className="mt-2">
              <button
                onClick={() => toggleSection("tools")}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 text-base font-medium rounded-md transition-colors",
                  isToolsActive
                    ? "bg-bitcoin text-white"
                    : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-200 dark:hover:bg-bitcoin/20",
                )}
              >
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Tools
                </div>
                {expandedSection === "tools" ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>

              {expandedSection === "tools" && (
                <div className="ml-4 mt-1 space-y-1">
                  {toolsItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        item.active
                          ? "bg-bitcoin/20 text-bitcoin dark:text-bitcoin-light"
                          : "text-gray-700 hover:bg-bitcoin/10 dark:text-gray-300 dark:hover:bg-bitcoin/10",
                      )}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

