"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bitcoin } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  // Update the navigation links to remove dashboard and statistics
  const links: { href: string; label: string; icon: any }[] = []

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t md:top-0 md:bottom-auto md:border-b md:border-t-0 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around md:justify-start md:space-x-8 h-16">
          <div className="hidden md:flex items-center mr-6">
            <Bitcoin className="h-6 w-6 text-bitcoin mr-2" />
            <span className="font-bold text-xl text-bitcoin-dark">CoinWait</span>
          </div>

          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "text-bitcoin font-medium"
                    : "text-muted-foreground hover:text-bitcoin hover:bg-bitcoin-background"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-bitcoin" : ""}`} />
                <span className="text-xs md:text-sm">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

