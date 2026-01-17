import type { Metadata } from "next"
import WorkshopsClient from "./WorkshopsClient"

export const metadata: Metadata = {
  title: "Workshops - Indus Valley Digital",
  description: "Learn from professional artists through hands-on workshops",
}

export default function WorkshopsPage() {
  return <WorkshopsClient />
}
