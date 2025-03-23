import { Mail } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer className="py-6 border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Logo />

          <div className="flex items-center text-sm text-muted-foreground mt-4 md:mt-0">
            <Mail className="h-4 w-4 mr-2" />
            <Link href="mailto:scottvan2008@gmail.com" className="hover:text-bitcoin transition-colors">
              scottvan2008@gmail.com
            </Link>
          </div>

          <div className="text-sm text-muted-foreground mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} CoinWait. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

