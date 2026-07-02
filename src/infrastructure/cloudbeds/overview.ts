import { CloudbedsClient } from "./client"
import { getCloudbedsConfig, type CloudbedsProperty } from "./config"

type UnknownRecord = Record<string, unknown>

export type CloudbedsReservationPreview = {
    id: string
    guestName: string
    startDate: string
    endDate: string
    status: string
    source: string
    roomNames: string[]
    roomTypeNames: string[]
}

export type CloudbedsRoomTypeSummary = {
    id: string
    name: string
    units: number
}

export type CloudbedsOverview = {
    property: CloudbedsProperty
    propertyId: string
    totalUnits: number
    occupiedUnits: number
    occupancyRate: number
    arrivalsToday: number
    departuresToday: number
    inHouse: number
    upcoming: CloudbedsReservationPreview[]
    roomTypes: CloudbedsRoomTypeSummary[]
    syncedAt: string
}

function recordsWithKey(data: unknown, key: string): UnknownRecord[] {
    if (Array.isArray(data)) {
        const direct = data.filter((item): item is UnknownRecord =>
            Boolean(item) && typeof item === "object" && key in item)
        return direct.length > 0 ? direct : data.flatMap((item) => recordsWithKey(item, key))
    }

    if (!data || typeof data !== "object") return []
    const record = data as UnknownRecord
    if (key in record) return [record]
    return Object.values(record).flatMap((item) => recordsWithKey(item, key))
}

function text(record: UnknownRecord, key: string, fallback = ""): string {
    const value = record[key]
    return typeof value === "string" || typeof value === "number" ? String(value) : fallback
}

function dateOnly(date: Date): string {
    return date.toISOString().slice(0, 10)
}

function isActiveStatus(status: string): boolean {
    return !["canceled", "cancelled", "no_show", "checked_out"].includes(status)
}

export async function getCloudbedsOverview(
    property: CloudbedsProperty,
    now = new Date(),
): Promise<CloudbedsOverview> {
    const config = getCloudbedsConfig(property)
    if (!config.propertyId) throw new Error(`Missing Cloudbeds property ID for ${property}`)

    const today = dateOnly(now)
    const from = new Date(now)
    from.setUTCDate(from.getUTCDate() - 30)
    const to = new Date(now)
    to.setUTCDate(to.getUTCDate() + 30)

    const client = new CloudbedsClient(config)
    const [roomsResponse, reservationsResponse] = await Promise.all([
        client.getRooms(config.propertyId),
        client.getReservations({
            propertyId: config.propertyId,
            checkInFrom: dateOnly(from),
            checkInTo: dateOnly(to),
        }),
    ])

    const rooms = recordsWithKey(roomsResponse.data, "roomID")
    const reservations = recordsWithKey(reservationsResponse.data, "reservationID")
    const activeReservations = reservations.filter((reservation) => isActiveStatus(text(reservation, "status")))

    const currentReservations = activeReservations.filter((reservation) =>
        text(reservation, "startDate") <= today && text(reservation, "endDate") > today)
    const occupiedRoomIds = new Set(
        currentReservations.flatMap((reservation) =>
            recordsWithKey(reservation.rooms, "roomID").map((room) => text(room, "roomID")).filter(Boolean)),
    )

    const roomTypeMap = new Map<string, CloudbedsRoomTypeSummary>()
    for (const room of rooms) {
        const id = text(room, "roomTypeID", "unknown")
        const existing = roomTypeMap.get(id)
        if (existing) {
            existing.units += 1
        } else {
            roomTypeMap.set(id, {
                id,
                name: text(room, "roomTypeName", "Room type"),
                units: 1,
            })
        }
    }

    const upcoming = activeReservations
        .filter((reservation) => text(reservation, "startDate") >= today)
        .sort((a, b) => text(a, "startDate").localeCompare(text(b, "startDate")))
        .slice(0, 10)
        .map((reservation): CloudbedsReservationPreview => {
            const assignedRooms = recordsWithKey(reservation.rooms, "roomID")
            return {
                id: text(reservation, "reservationID"),
                guestName: text(reservation, "guestName", "Guest"),
                startDate: text(reservation, "startDate"),
                endDate: text(reservation, "endDate"),
                status: text(reservation, "status", "unknown"),
                source: text(reservation, "sourceName", "Direct"),
                roomNames: assignedRooms.map((room) => text(room, "roomName")).filter(Boolean),
                roomTypeNames: [...new Set(assignedRooms.map((room) => text(room, "roomTypeName")).filter(Boolean))],
            }
        })

    const occupiedUnits = occupiedRoomIds.size
    return {
        property,
        propertyId: config.propertyId,
        totalUnits: rooms.length,
        occupiedUnits,
        occupancyRate: rooms.length > 0 ? Math.round((occupiedUnits / rooms.length) * 100) : 0,
        arrivalsToday: activeReservations.filter((reservation) => text(reservation, "startDate") === today).length,
        departuresToday: activeReservations.filter((reservation) => text(reservation, "endDate") === today).length,
        inHouse: currentReservations.length,
        upcoming,
        roomTypes: [...roomTypeMap.values()].sort((a, b) => a.name.localeCompare(b.name)),
        syncedAt: now.toISOString(),
    }
}
