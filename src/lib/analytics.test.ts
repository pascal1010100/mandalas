import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }))
vi.mock("posthog-js", () => ({ default: { capture: vi.fn() } }))

import { track } from "@vercel/analytics"
import posthog from "posthog-js"
import {
  normalizePublicProperty,
  trackBookingIntent,
  trackWhatsAppIntent,
} from "./analytics"

describe("public analytics", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "")
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("normalizes property names without exposing arbitrary input", () => {
    expect(normalizePublicProperty("Mandalas Hideout")).toBe("hideout")
    expect(normalizePublicProperty("Mandalas Hostal")).toBe("mandalas")
    expect(normalizePublicProperty()).toBe("unspecified")
  })

  it("tracks only the property and source for booking intent", () => {
    trackBookingIntent("hideout", "stay_options")
    expect(track).toHaveBeenCalledWith("booking_intent", {
      property: "hideout",
      source: "stay_options",
    })
  })

  it("tracks only the property and source for WhatsApp intent", () => {
    trackWhatsAppIntent("mandalas", "contact_form")
    expect(track).toHaveBeenCalledWith("whatsapp_intent", {
      property: "mandalas",
      source: "contact_form",
    })
  })

  it("does not send PostHog events when it is not configured", () => {
    trackBookingIntent("mandalas", "navbar")
    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it("does not send PostHog events when the host is missing", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")

    trackBookingIntent("mandalas", "navbar")

    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it("sends only approved properties to PostHog when configured", () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN", "phc_test")
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://us.i.posthog.com")

    trackBookingIntent("hideout", "stay_options")

    expect(posthog.capture).toHaveBeenCalledWith("booking_intent", {
      property: "hideout",
      source: "stay_options",
    })
  })
})
