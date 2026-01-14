import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - Indus Valley",
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/">
            <Logo size="lg" />
          </Link>

          <h1 className="mt-6 text-2xl font-serif font-bold">
            Reset your password
          </h1>

          <p className="mt-2 text-muted-foreground">
            Enter your email and we’ll send you a reset link.
          </p>

          <div className="mt-6">
            <ForgotPasswordForm />
          </div>

          <p className="mt-6 text-center text-sm">
            <Link href="/login" className="text-primary">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
