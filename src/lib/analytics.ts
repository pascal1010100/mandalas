import { track } from "@vercel/analytics"
import posthog from "posthog-js"

export type PublicProperty = "mandalas" | "hideout" | "unspecified"
export type AnalyticsSource =
  | "booking_link"
  | "consultation_link"
  | "contact_card"
  | "contact_form"
  | "navbar"
  | "stay_options"

export function normalizePublicProperty(location?: string): PublicProperty {
  if (!location) return "unspecified"
  return location.toLowerCase().includes("hideout") ? "hideout" : "mandalas"
}

export function trackBookingIntent(
  property: PublicProperty,
  source: AnalyticsSource,
) {
  track("booking_intent", { property, source })
  capturePostHog("booking_intent", property, source)
}

export function trackWhatsAppIntent(
  property: PublicProperty,
  source: AnalyticsSource,
) {
  track("whatsapp_intent", { property, source })
  capturePostHog("whatsapp_intent", property, source)
}

function capturePostHog(
  event: "booking_intent" | "whatsapp_intent",
  property: PublicProperty,
  source: AnalyticsSource,
) {
  if (
    !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !process.env.NEXT_PUBLIC_POSTHOG_HOST
  ) {
    return
  }

  posthog.capture(event, { property, source })
}
