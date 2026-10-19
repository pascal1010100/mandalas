import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mandalasUrl = "https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq"
const hideoutUrl = "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq"

describe("booking engine routing", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED", undefined)
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL", undefined)
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL", undefined)
  })

  afterEach(() => vi.unstubAllEnvs())

  it("routes both properties to their own engines by default", async () => {
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Mandalas Hideout")).toBe(hideoutUrl)
    expect(getBookingEngineUrl("Mandalas Hostal")).toBe(mandalasUrl)
    expect(getBookingEngineUrl()).toBeUndefined()
  })

  it("can explicitly pause Hideout without affecting Mandalas", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED", "false")
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Hideout")).toBeUndefined()
    expect(getBookingEngineUrl("Mandalas")).toBe(mandalasUrl)
  })

  it("supports explicitly enabling Hideout", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED", "true")
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("HIDEOUT")).toBe(hideoutUrl)
  })

  it("preserves property-specific environment URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL", "https://hotels.cloudbeds.com/reservation/hideout-test")
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Hideout")).toBe("https://hotels.cloudbeds.com/reservation/hideout-test")
    expect(getBookingEngineUrl("Mandalas")).toBe(mandalasUrl)
  })
})
