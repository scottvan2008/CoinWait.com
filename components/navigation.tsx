"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bitcoin, LineChart } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Crypto Market",
      href: "/",
      icon: <LineChart className="h-5 w-5" />,
      active: pathname === "/",
    },
    {
      name: "Bitcoin Halving",
      href: "/bitcoin",
      icon: <Bitcoin className="h-5 w-5" />,
      active: pathname === "/bitcoin",
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

