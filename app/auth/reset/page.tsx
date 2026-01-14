import type { Metadata } from "next"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Set New Password - Indus Valley",
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-serif font-bold">
          Set new password
        </h1>

        <ResetPasswordForm />
      </div>
    </div>
  )
}
