import { track } from "@vercel/analytics"

export type PublicProperty = "mandalas" | "hideout" | "unspecified"

export function normalizePublicProperty(location?: string): PublicProperty {
  if (!location) return "unspecified"
  return location.toLowerCase().includes("hideout") ? "hideout" : "mandalas"
}

export function trackBookingIntent(property: PublicProperty, source: string) {
  track("booking_intent", { property, source })
}

export function trackWhatsAppIntent(property: PublicProperty, source: string) {
  track("whatsapp_intent", { property, source })
}
