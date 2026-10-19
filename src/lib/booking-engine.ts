const bookingEngineUrls = {
  mandalas:
    process.env.NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL ||
    "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
  hideout:
    process.env.NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL ||
    "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
} as const

/** Hideout booking is active by default. Operations can explicitly pause it
 * with NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED=false. */
const hideoutBookingEnabled = process.env.NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED !== "false"

export function getBookingEngineUrl(location?: string) {
  if (!location) return undefined

  if (location.toLowerCase().includes("hideout") && !hideoutBookingEnabled) {
    return undefined
  }

  return location.toLowerCase().includes("hideout")
    ? bookingEngineUrls.hideout
    : bookingEngineUrls.mandalas
}
