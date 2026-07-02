import { describe, expect, it } from "vitest"
import { parseCloudbedsWebhook } from "./webhook-event"

describe("parseCloudbedsWebhook", () => {
    it("normalizes a reservation created event", () => {
        const event = parseCloudbedsWebhook({
            event: "reservation/created",
            propertyID: 320211,
            reservationID: "9911",
            startDate: "2026-07-02",
            endDate: "2026-07-04",
            timestamp: 1782993600,
        })

        expect(event.propertyId).toBe("320211")
        expect(event.reservationId).toBe("9911")
        expect(event.details.startDate).toBe("2026-07-02")
        expect(event.eventKey).toHaveLength(64)
    })

    it("produces the same idempotency key for a duplicate", () => {
        const payload = {
            event: "reservation/status_changed",
            propertyId: "320211",
            reservationId: "9911",
            status: "confirmed",
            timestamp: 1782993600.25,
        }

        expect(parseCloudbedsWebhook(payload).eventKey).toBe(parseCloudbedsWebhook(payload).eventKey)
    })

    it("rejects unsupported events", () => {
        expect(() => parseCloudbedsWebhook({
            event: "guest/created",
            propertyID: "320211",
            timestamp: 1782993600,
        })).toThrow("Unsupported")
    })
})
