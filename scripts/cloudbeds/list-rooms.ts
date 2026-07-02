import path from "node:path"
import dotenv from "dotenv"
import { CloudbedsClient } from "../../src/infrastructure/cloudbeds/client"
import { getCloudbedsConfig } from "../../src/infrastructure/cloudbeds/config"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true })

type RoomRecord = Record<string, unknown>

function roomRecords(data: unknown): RoomRecord[] {
    if (Array.isArray(data)) {
        const records = data.filter((item): item is RoomRecord => Boolean(item) && typeof item === "object")
        const nestedRooms = records.flatMap((record) => roomRecords(record.rooms))
        return nestedRooms.length > 0 ? nestedRooms : records
    }

    if (!data || typeof data !== "object") return []

    const record = data as RoomRecord
    for (const key of ["rooms", "items", "results"]) {
        const nested = record[key]
        if (Array.isArray(nested)) {
            return nested.filter((item): item is RoomRecord => Boolean(item) && typeof item === "object")
        }
    }

    return [record]
}

function value(record: RoomRecord, keys: string[]): string {
    for (const key of keys) {
        const candidate = record[key]
        if (typeof candidate === "string" || typeof candidate === "number") return String(candidate)
    }
    return "—"
}

function describeShape(data: unknown, depth = 0): unknown {
    if (depth > 3) return typeof data
    if (Array.isArray(data)) {
        return {
            length: data.length,
            item: data.length > 0 ? describeShape(data[0], depth + 1) : "empty",
        }
    }
    if (!data || typeof data !== "object") return typeof data

    return Object.fromEntries(
        Object.entries(data as RoomRecord).map(([key, nested]) => [key, describeShape(nested, depth + 1)]),
    )
}

async function listHideoutRooms() {
    const config = getCloudbedsConfig("hideout")
    if (!config.propertyId) {
        throw new Error("CLOUDBEDS_HIDEOUT_PROPERTY_ID is required")
    }

    const client = new CloudbedsClient(config)
    const response = await client.getRooms(config.propertyId)
    const rooms = roomRecords(response.data)

    if (rooms.length === 0) {
        throw new Error("Cloudbeds returned no rooms for Hideout")
    }

    if (rooms.every((room) => value(room, ["roomID", "roomId", "id"]) === "—")) {
        console.log("Cloudbeds response shape (field names only):")
        console.dir(describeShape(response.data), { depth: null })
        throw new Error("Cloudbeds returned an unrecognized room response shape")
    }

    console.log(`Hideout rooms returned by Cloudbeds: ${rooms.length}`)
    console.table(rooms.map((room) => ({
        roomId: value(room, ["roomID", "roomId", "id"]),
        room: value(room, ["roomName", "name", "roomNameShort"]),
        roomTypeId: value(room, ["roomTypeID", "roomTypeId", "typeID"]),
        roomType: value(room, ["roomTypeName", "roomTypeNameShort", "typeName"]),
        maxGuests: value(room, ["maxGuests", "roomTypeMaxGuests", "capacity"]),
    })))
}

listHideoutRooms().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown inventory error"
    console.error(`Cloudbeds room lookup failed: ${message}`)
    process.exitCode = 1
})
