import type { Metadata } from "next"
import EventsClient from "./EventsClient"

export const metadata: Metadata = {
  title: "Events - Indus Valley Digital",
  description: "Explore upcoming events, workshops, and live experiences",
}

export default function EventsPage() {
  return <EventsClient />
}
