import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("public booking engines", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED", undefined)
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL", undefined)
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_MANDALAS_URL", undefined)
  })

  afterEach(() => vi.unstubAllEnvs())

  it("enables the confirmed Hideout booking engine by default", async () => {
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Hideout")).toBe("https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq")
  })
  it("recognizes the full Hideout property name case-insensitively", async () => {
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("MANDALAS HIDEOUT")).toBe("https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq")
  })

  it("preserves the independent Mandalas engine", async () => {
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Mandalas")).toBe("https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq")
  })

  it("keeps the explicit emergency opt-out without disabling Mandalas", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED", "false")
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Hideout")).toBeUndefined()
    expect(getBookingEngineUrl("Mandalas")).toBe("https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq")
  })

  it("supports explicitly enabling Hideout", async () => {
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_BOOKING_ENABLED", "true")
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Hideout")).toBe("https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=gtq")
  })

  it("keeps unassigned stay selection out of either external engine", async () => {
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl()).toBeUndefined()
  })

  it("preserves a public Hideout URL override without affecting Mandalas", async () => {
    const configured = "https://hotels.cloudbeds.com/en/reservation/Uk2zHr?currency=usd"
    vi.stubEnv("NEXT_PUBLIC_CLOUDBEDS_HIDEOUT_URL", configured)
    const { getBookingEngineUrl } = await import("./booking-engine")
    expect(getBookingEngineUrl("Hideout")).toBe(configured)
    expect(getBookingEngineUrl("Mandalas")).toBe("https://hotels.cloudbeds.com/en/reservation/5VReHj?currency=gtq")
  })
})
