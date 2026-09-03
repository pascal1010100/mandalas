const bookingEngineUrls = {
  mandalas:
    process.env.NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL ||
    "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
  hideout:
    process.env.NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL ||
    "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
} as const

/** Hideout's Cloudbeds engine is temporarily disabled by operations.
 * Set NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED=true when it is live again. */
const hideoutBookingEnabled = process.env.NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED === "true"

export function getBookingEngineUrl(location?: string) {
  if (!location) return undefined

  if (location.toLowerCase().includes("hideout") && !hideoutBookingEnabled) {
    return undefined
  }

  return location.toLowerCase().includes("hideout")
    ? bookingEngineUrls.hideout
    : bookingEngineUrls.mandalas
}
