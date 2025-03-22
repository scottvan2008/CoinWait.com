"use client"
import { Bitcoin } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  // We're not using pathname since there are no links, so we can remove it
  // const pathname = usePathname()

  // This array is empty and not being used, so we can remove it
  // const links: { href: string; label: string; icon: any }[] = []

  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Bitcoin className="h-6 w-6 text-bitcoin mr-2" />
            <span className="font-bold text-xl text-bitcoin-dark dark:text-white">CoinWait</span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

