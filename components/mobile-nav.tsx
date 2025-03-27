"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Bitcoin, LineChart, Building, AlertCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: "Crypto Market",
      href: "/",
      icon: <LineChart className="h-5 w-5 mr-2" />,
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
    {
      name: "Performance",
      href: "/monthly-returns",
      icon: <Calendar className="h-5 w-5 mr-2" />,
      active: pathname === "/monthly-returns",
    },
    {
      name: "Fear & Greed",
      href: "/fear-greed",
      icon: <AlertCircle className="h-5 w-5 mr-2" />,
      active: pathname === "/fear-greed",
    },
  ]

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
            {navItems.map((item) => (
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
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

