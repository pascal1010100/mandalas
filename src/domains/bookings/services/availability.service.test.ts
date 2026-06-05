import { describe, expect, it } from "vitest"
import { AvailabilityService } from "./availability.service"
import type { Booking } from "../types/types"
import type { RoomConfig } from "@/lib/store"

const privateRoom: RoomConfig = {
    id: "pueblo_private_1",
    label: "Habitacion Privada 1",
    location: "pueblo",
    type: "private",
    capacity: 4,
    maxGuests: 2,
    basePrice: 45,
}

function makeService(overlaps: Booking[]) {
    const repo = {
        findOverlapping: async () => overlaps,
    }

    return new AvailabilityService(
        repo as ConstructorParameters<typeof AvailabilityService>[0],
        () => privateRoom
    )
}

describe("AvailabilityService", () => {
    it("blocks private rooms when any active booking overlaps, even if legacy capacity is greater than one", async () => {
        const service = makeService([
            {
                id: "existing",
                guestName: "Existing Guest",
                email: "guest@example.com",
                location: "pueblo",
                roomType: "pueblo_private_1",
                guests: "2",
                checkIn: "2026-08-10",
                checkOut: "2026-08-12",
                status: "confirmed",
                totalPrice: 90,
                createdAt: "2026-06-03T00:00:00.000Z",
            },
        ])

        await expect(
            service.checkAvailability({
                location: "pueblo",
                roomId: "pueblo_private_1",
                startDate: "2026-08-10",
                endDate: "2026-08-12",
                requestedGuests: 2,
            })
        ).resolves.toBe(false)
    })

    it("blocks private rooms when requested guests exceed max guests", async () => {
        const service = makeService([])

        await expect(
            service.checkAvailability({
                location: "pueblo",
                roomId: "pueblo_private_1",
                startDate: "2026-08-10",
                endDate: "2026-08-12",
                requestedGuests: 3,
            })
        ).resolves.toBe(false)
    })
})
