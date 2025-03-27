"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bitcoin, LineChart, Building, AlertCircle, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  // Update the navItems array to include the new Monthly Returns page
  const navItems = [
    {
      name: "Crypto Market",
      href: "/",
      icon: <LineChart className="h-5 w-5" />,
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
    {
      name: "Performance",
      href: "/monthly-returns",
      icon: <Calendar className="h-5 w-5" />,
      active: pathname === "/monthly-returns",
    },
    {
      name: "Fear & Greed",
      href: "/fear-greed",
      icon: <AlertCircle className="h-5 w-5" />,
      active: pathname === "/fear-greed",
    },
  ]

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
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
    </nav>
  )
}

