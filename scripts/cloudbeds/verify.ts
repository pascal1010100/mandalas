import path from "node:path"
import dotenv from "dotenv"
import { CloudbedsClient } from "../../src/infrastructure/cloudbeds/client"
import { getCloudbedsConfig } from "../../src/infrastructure/cloudbeds/config"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), quiet: true })

type HotelRecord = Record<string, unknown>

function asRecords(data: unknown): HotelRecord[] {
    if (Array.isArray(data)) return data.filter((item): item is HotelRecord => Boolean(item) && typeof item === "object")
    if (data && typeof data === "object") return [data as HotelRecord]
    return []
}

function firstString(record: HotelRecord, keys: string[]): string | undefined {
    for (const key of keys) {
        const value = record[key]
        if (typeof value === "string" || typeof value === "number") return String(value)
    }
    return undefined
}

async function verifyHideout() {
    const config = getCloudbedsConfig("hideout")
    const client = new CloudbedsClient(config)
    const hotelsResponse = await client.getHotels()
    const hotels = asRecords(hotelsResponse.data)

    if (hotels.length === 0) {
        throw new Error("Cloudbeds authenticated successfully but returned no properties")
    }

    const hotel = hotels[0]
    const propertyId = config.propertyId || firstString(hotel, ["propertyID", "propertyId", "id"])

    if (!propertyId) {
        throw new Error("Connected to Cloudbeds, but could not determine the Hideout property ID")
    }

    const detailsResponse = await client.getHotelDetails(propertyId)
    const details = asRecords(detailsResponse.data)[0] || {}

    console.log("Cloudbeds connection verified")
    console.table([{
        property: "hideout",
        id: propertyId,
        name: firstString(details, ["propertyName", "name", "hotelName"]) || firstString(hotel, ["propertyName", "name", "hotelName"]) || "Connected property",
        currency: firstString(details, ["propertyCurrency", "currency", "currencyCode"]) || "Not returned",
        timezone: firstString(details, ["propertyTimezone", "timezone", "timeZone"]) || "Not returned",
    }])
}

verifyHideout().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Unknown verification error"
    console.error(`Cloudbeds verification failed: ${message}`)
    process.exitCode = 1
})
