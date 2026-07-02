import { createHash } from "node:crypto"

export const SUPPORTED_CLOUDBEDS_EVENTS = new Set([
    "reservation/created",
    "reservation/status_changed",
    "reservation/dates_changed",
    "reservation/accommodation_status_changed",
    "reservation/accommodation_type_changed",
    "reservation/accommodation_changed",
    "reservation/accommodation_removed",
    "reservation/deleted",
])

export type CloudbedsWebhookEvent = {
    eventKey: string
    eventName: string
    propertyId: string
    reservationId: string | null
    occurredAt: string
    details: Record<string, string | number | null>
}
type UnknownRecord = Record<string, unknown>

function stringValue(record: UnknownRecord, ...keys: string[]): string | null {
    for (const key of keys) {
        const value = record[key]
        if (typeof value === "string" || typeof value === "number") return String(value)
    }
    return null
}

function timestampValue(payload: UnknownRecord): string {
    const timestamp = payload.timestamp
    if (typeof timestamp === "number" && Number.isFinite(timestamp)) {
        return new Date(timestamp * 1000).toISOString()
    }
    if (typeof timestamp === "string") {
        const numeric = Number(timestamp)
        if (Number.isFinite(numeric)) return new Date(numeric * 1000).toISOString()
        const parsed = new Date(timestamp)
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString()
    }
    throw new Error("Cloudbeds webhook is missing a valid timestamp")
}

export function parseCloudbedsWebhook(payload: unknown): CloudbedsWebhookEvent {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new Error("Cloudbeds webhook payload must be an object")
    }

    const record = payload as UnknownRecord
    const eventName = stringValue(record, "event")
    if (!eventName || !SUPPORTED_CLOUDBEDS_EVENTS.has(eventName)) {
        throw new Error("Unsupported Cloudbeds webhook event")
    }

    const propertyId = stringValue(record, "propertyID", "propertyId", "propertyID_str", "propertyId_str")
    if (!propertyId) throw new Error("Cloudbeds webhook is missing property ID")

    const reservationId = stringValue(record, "reservationID", "reservationId")
    const occurredAt = timestampValue(record)
    const details = {
        status: stringValue(record, "status"),
        startDate: stringValue(record, "startDate"),
        endDate: stringValue(record, "endDate"),
        roomId: stringValue(record, "roomID", "roomId"),
        previousRoomId: stringValue(record, "roomIDPrev", "roomIdPrev"),
        roomTypeId: stringValue(record, "roomTypeID", "roomTypeId"),
        subReservationId: stringValue(record, "subReservationID", "subReservationId"),
    }
    const signature = JSON.stringify({ eventName, propertyId, reservationId, occurredAt, details })
    const eventKey = createHash("sha256").update(signature).digest("hex")

    return { eventKey, eventName, propertyId, reservationId, occurredAt, details }
}
