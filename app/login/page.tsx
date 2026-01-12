import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { AuthForm } from "@/components/auth/authForm"

export const metadata: Metadata = {
  title: "Log In - Indus Valley Digital",
  description: "Log in to your Indus Valley Digital account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-background">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link href="/">
              <Logo size="lg" />
            </Link>

            {/* ⬇️ EXACT typography from FIRST CODE */}
            <h1 className="mt-6 font-serif text-3xl font-bold text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-muted-foreground">
              Log in to continue your artistic journey
            </p>
          </div>

          {/* ✅ ONLY FUNCTIONALITY CHANGE */}
          <AuthForm mode="login" />

          {/* ⬇️ EXACT footer from FIRST CODE */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual (UNCHANGED) */}
      <div className="hidden lg:flex lg:flex-1 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-md">
            <blockquote className="text-2xl font-serif italic leading-relaxed">
              &ldquo;Indus Valley has the vision to fuel the growth of the creative
              industry by empowering artists to become creative entrepreneurs!.&rdquo;
            </blockquote>

            <div className="mt-6">
              <p className="font-semibold">Harsh Narayan</p>
              <p className="text-primary-foreground/70 text-sm">
                Founder, Indus Valley Digital
              </p>
            </div>
          </div>
        </div>

        {/* Decorative blobs — UNCHANGED */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>
    </div>
  )
}
