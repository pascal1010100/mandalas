const bookingEngineUrls = {
  mandalas:
    process.env.NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL ||
    "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq",
  hideout:
    process.env.NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL ||
    "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq",
} as const

export function getBookingEngineUrl(location?: string) {
  if (!location) return undefined

  return location.toLowerCase().includes("hideout")
    ? bookingEngineUrls.hideout
    : bookingEngineUrls.mandalas
}
