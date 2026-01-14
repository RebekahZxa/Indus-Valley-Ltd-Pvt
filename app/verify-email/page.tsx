"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resendEmail = async () => {
    setLoading(true)
    setError(null)
    try {
      const email = localStorage.getItem("signupEmail")
      if (!email) throw new Error("No email found to resend verification link.")

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/signup/verify-email` },
      })
      if (error) throw error
      setSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-muted-foreground">
          A verification link has been sent to your email. Please check your inbox and click the link to verify your account.
        </p>

        {error && <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
        {sent && <div className="rounded-lg bg-success/10 p-3 text-sm text-success">Verification email resent!</div>}

        <Button onClick={resendEmail} disabled={loading} className="w-full gradient-primary">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Resend Verification Email
        </Button>

        <p className="text-sm text-muted-foreground mt-4">
          Already verified?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
