"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  onboardingCompleted: boolean | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  onboardingCompleted: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [onboardingCompleted, setOnboardingCompleted] =
    useState<boolean | null>(null)

  useEffect(() => {
    const loadSessionAndProfile = async () => {
      setLoading(true)

      const { data } = await supabase.auth.getSession()
      const sessionUser = data.session?.user ?? null

      setUser(sessionUser)

      // Only check onboarding for artists
      if (sessionUser?.user_metadata?.role === "artist") {
        const { data: artist, error } = await supabase
          .from("artists")
          .select("onboarding_completed")
          .eq("profile_id", sessionUser.id)
          .single()

        if (!error && artist) {
          setOnboardingCompleted(artist.onboarding_completed)
        } else {
          // Artist exists but onboarding not done or row missing
          setOnboardingCompleted(false)
        }
      } else {
        setOnboardingCompleted(null)
      }

      setLoading(false)
    }

    loadSessionAndProfile()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null
      setUser(sessionUser)

      if (sessionUser?.user_metadata?.role === "artist") {
        supabase
          .from("artists")
          .select("onboarding_completed")
          .eq("profile_id", sessionUser.id)
          .single()
          .then(({ data }) => {
            setOnboardingCompleted(data?.onboarding_completed ?? false)
          })
      } else {
        setOnboardingCompleted(null)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, loading, onboardingCompleted }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
