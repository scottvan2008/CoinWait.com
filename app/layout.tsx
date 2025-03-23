import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageLoading } from "@/components/page-loading"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: {
    default: "CoinWait - Cryptocurrency Tracker",
    template: "%s | CoinWait",
  },
  description: "Track cryptocurrency prices and Bitcoin halving in real-time",
  icons: {
    icon: [{ url: "/logo.png" }],
    apple: [{ url: "/logo.png" }],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PageLoading />
          <Header />
          <div className="min-h-screen">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'