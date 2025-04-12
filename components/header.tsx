"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { MobileNav } from "@/components/mobile-nav"
import { useIsMobile } from "@/hooks/use-mobile"
import { RefreshCw } from "lucide-react"

export function Header() {
  const isMobile = useIsMobile()

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <MobileNav />
            <Logo />
            <div className="ml-6 hidden md:block">
              <Navigation />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={handleRefresh}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
                aria-label="Refresh page"
              >
                <RefreshCw size={20} />
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
