import { CryptoDashboard } from "@/components/crypto/crypto-dashboard"
import Link from "next/link"

export const metadata = {
  title: "CoinWait - Cryptocurrency Market",
  description: "Track cryptocurrency prices and market data in real-time",
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 pb-24 md:p-8 md:pt-6 md:pb-16">
      <div className="w-full max-w-4xl mx-auto">
        {/* Satoshi Quote */}
        <div className="mb-6 p-4 bg-gradient-to-r from-bitcoin-background to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-bitcoin/20 dark:border-bitcoin/10 shadow-sm">
          <blockquote className="text-sm md:text-base italic text-bitcoin-dark dark:text-white">
            <p className="mb-2">
              "If you don't believe me or don't get it, I don't have time to try to convince you, sorry."
            </p>
            <footer className="text-right">
              <Link
                href="https://satoshi.nakamotoinstitute.org/posts/bitcointalk/287/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-bitcoin hover:text-bitcoin-hover dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                <cite className="not-italic font-medium text-sm">
                  Satoshi Nakamoto
                  <span className="block text-xs text-gray-600 dark:text-gray-400">Bitcoin Talk, 2010-07-29</span>
                </cite>
              </Link>
            </footer>
          </blockquote>
        </div>

        <CryptoDashboard />
      </div>
    </main>
  )
}

