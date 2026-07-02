import { describe, expect, it } from "vitest"
import { buildCloudbedsAlert } from "./webhook-alert"
import type { CloudbedsWebhookEvent } from "./webhook-event"

function event(overrides: Partial<CloudbedsWebhookEvent> = {}): CloudbedsWebhookEvent {
    return {
        eventKey: "key",
        eventName: "reservation/created",
        propertyId: "320211",
        reservationId: "9911",
        occurredAt: "2026-07-02T14:00:00.000Z",
        details: {
            status: null,
            startDate: "2026-07-02",
            endDate: "2026-07-04",
            roomId: null,
            previousRoomId: null,
            roomTypeId: null,
            subReservationId: null,
        },
        ...overrides,
    }
}

describe("buildCloudbedsAlert", () => {
    it("marks same-day reservations as urgent", () => {
        const alert = buildCloudbedsAlert(event(), new Date("2026-07-02T15:00:00.000Z"))
        expect(alert.priority).toBe("urgent")
        expect(alert.title).toBe("Reserva nueva para hoy")
    })

    it("marks removed accommodations as urgent", () => {
        const alert = buildCloudbedsAlert(event({ eventName: "reservation/accommodation_removed" }))
        expect(alert.priority).toBe("urgent")
        expect(alert.message).toContain("Cloudbeds")
    })

    it("does not include guest contact information", () => {
        const alert = buildCloudbedsAlert(event())
        expect(alert.message).toBe("Reserva: 9911\nEstadía: 2026-07-02 → 2026-07-04\nRevisar la nueva reserva en Cloudbeds.")
    })
})
