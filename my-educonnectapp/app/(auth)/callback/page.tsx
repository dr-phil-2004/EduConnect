"use client"

import { useEffect } from "react"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function CallbackPage() {
  const { handleRedirectCallback } = useClerk()
  const router = useRouter()

  useEffect(() => {
    async function handleCallback() {
      try {
        await handleRedirectCallback()
        router.push("/dashboard")
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/sign-in?error=callback")
      }
    }

    handleCallback()
  }, [handleRedirectCallback, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
