"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export function PageLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    // Add event listeners for route changes
    router.events?.on("routeChangeStart", handleStart)
    router.events?.on("routeChangeComplete", handleComplete)
    router.events?.on("routeChangeError", handleComplete)

    return () => {
      router.events?.off("routeChangeStart", handleStart)
      router.events?.off("routeChangeComplete", handleComplete)
      router.events?.off("routeChangeError", handleComplete)
    }
  }, [router])

  // Reset loading state when the route changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-bitcoin-background">
      <div className="h-full bg-bitcoin animate-pulse" style={{ width: "30%" }} />
    </div>
  )
}

