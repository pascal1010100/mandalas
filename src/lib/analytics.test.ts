import { describe, expect, it, vi } from "vitest"

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }))

import { track } from "@vercel/analytics"
import {
  normalizePublicProperty,
  trackBookingIntent,
  trackWhatsAppIntent,
} from "./analytics"

describe("public analytics", () => {
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
})
