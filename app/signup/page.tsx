import type { Metadata } from "next"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { SignupForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up - Artistry",
  description: "Create your Artistry account",
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex lg:flex-1 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-md">
            <h2 className="text-3xl font-serif font-bold mb-4">Join the Community</h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              Whether you&apos;re a filmmaker, musician, painter, craftsman, dancer, or artisan — Artistry is your space
              to shine.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">2.5K+</p>
                <p className="text-sm text-primary-foreground/70">Artists</p>
              </div>
              <div>
                <p className="text-3xl font-bold">150+</p>
                <p className="text-sm text-primary-foreground/70">Weekly Events</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50K+</p>
                <p className="text-sm text-primary-foreground/70">Art Lovers</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-background">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <Link href="/">
              <Logo size="lg" />
            </Link>
            <h1 className="mt-6 font-serif text-3xl font-bold text-foreground">Create your account</h1>
            <p className="mt-2 text-muted-foreground">Start your journey on Artistry</p>
          </div>

          <SignupForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
