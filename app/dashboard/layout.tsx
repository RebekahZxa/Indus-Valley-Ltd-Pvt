import { RequireArtistOnboarding } from "@/components/auth/RequireArtistOnboarding"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RequireArtistOnboarding>
      {children}
    </RequireArtistOnboarding>
  )
}
