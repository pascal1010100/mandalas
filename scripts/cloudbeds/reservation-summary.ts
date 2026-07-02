import path from "node:path"
import dotenv from "dotenv"
import { CloudbedsClient } from "../../src/infrastructure/cloudbeds/client"
import { getCloudbedsConfig } from "../../src/infrastructure/cloudbeds/config"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true })

type ReservationRecord = Record<string, unknown>

function dateOnly(date: Date): string {
    return date.toISOString().slice(0, 10)
}

function collectReservations(data: unknown): ReservationRecord[] {
    if (Array.isArray(data)) {
        const direct = data.filter((item): item is ReservationRecord =>
            Boolean(item) && typeof item === "object" && "reservationID" in item)
        if (direct.length > 0) return direct
        return data.flatMap(collectReservations)
    }

    if (!data || typeof data !== "object") return []
    const record = data as ReservationRecord
    if ("reservationID" in record) return [record]
    return Object.values(record).flatMap(collectReservations)
}

async function summarizeHideoutReservations() {
    const config = getCloudbedsConfig("hideout")
    if (!config.propertyId) throw new Error("CLOUDBEDS_HIDEOUT_PROPERTY_ID is required")

    const from = new Date()
    const to = new Date(from)
    to.setUTCDate(to.getUTCDate() + 30)

    const client = new CloudbedsClient(config)
    const response = await client.getReservations({
        propertyId: config.propertyId,
        checkInFrom: dateOnly(from),
        checkInTo: dateOnly(to),
    })
    const reservations = collectReservations(response.data)
    if (process.env.CLOUDBEDS_DEBUG_SHAPE === "true" && reservations[0]) {
        console.log("Reservation fields:", Object.keys(reservations[0]).sort().join(", "))
        const room = Array.isArray(reservations[0].rooms) ? reservations[0].rooms[0] : undefined
        if (room && typeof room === "object") {
            console.log("Reservation room fields:", Object.keys(room).sort().join(", "))
        }
    }
    const byStatus = reservations.reduce<Record<string, number>>((counts, reservation) => {
        const status = typeof reservation.status === "string" ? reservation.status : "unknown"
        counts[status] = (counts[status] || 0) + 1
        return counts
    }, {})

    console.log("Hideout reservation summary (guest details excluded)")
    console.log(`Check-in range: ${dateOnly(from)} to ${dateOnly(to)}`)
    console.log(`Reservations: ${reservations.length}`)
    console.table(Object.entries(byStatus).map(([status, count]) => ({ status, count })))
}

summarizeHideoutReservations().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown reservation error"
    console.error(`Cloudbeds reservation summary failed: ${message}`)
    process.exitCode = 1
})
