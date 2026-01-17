import type { Metadata } from "next"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
  title: "Notifications - Indus Valley Digital",
}

export default function NotificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <h1 className="font-serif text-3xl font-bold mb-4">Notifications</h1>
          <p className="text-muted-foreground">
            Notifications will appear here soon.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
