"use client"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/logo"
import { Navigation } from "@/components/navigation"
import { MobileNav } from "@/components/mobile-nav"

export function Header() {
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

