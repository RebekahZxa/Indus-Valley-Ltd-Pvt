"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/AuthContext/AuthContext"

export function RequireArtistOnboarding({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, onboardingCompleted } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (
      user &&
      user.user_metadata?.role === "artist" &&
      onboardingCompleted === false
    ) {
      router.replace("/signup/artist-onboarding")
    }
  }, [user, loading, onboardingCompleted, router])

  if (loading) return null

  return <>{children}</>
}
