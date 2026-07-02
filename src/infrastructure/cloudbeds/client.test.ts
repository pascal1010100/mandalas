import { describe, expect, it, vi } from "vitest"
import { CloudbedsApiError, CloudbedsClient } from "./client"

const config = {
    apiKey: "cbat_test_key",
    baseUrl: "https://api.cloudbeds.test/api/v1.3",
}

describe("CloudbedsClient", () => {
    it("sends the API key only in the request header", async () => {
        const fetcher = vi.fn<(input: URL, init: RequestInit) => Promise<Response>>(async () =>
            new Response(JSON.stringify({ success: true, data: [] }), { status: 200 }))
        const client = new CloudbedsClient(config, fetcher as typeof fetch)

        await client.getHotels()

        const [url, options] = fetcher.mock.calls[0]
        expect(url.toString()).toBe("https://api.cloudbeds.test/api/v1.3/getHotels")
        expect(url.toString()).not.toContain(config.apiKey)
        expect(options).toMatchObject({ headers: { "x-api-key": config.apiKey } })
    })

    it("adds the property ID to property-specific requests", async () => {
        const fetcher = vi.fn<(input: URL, init: RequestInit) => Promise<Response>>(async () =>
            new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }))
        const client = new CloudbedsClient(config, fetcher as typeof fetch)

        await client.getHotelDetails("320211")

        const [url] = fetcher.mock.calls[0]
        expect(url.searchParams.get("propertyID")).toBe("320211")
    })

    it("returns a safe typed error without exposing the API key", async () => {
        const fetcher = vi.fn<(input: URL, init: RequestInit) => Promise<Response>>(async () =>
            new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 }))
        const client = new CloudbedsClient(config, fetcher as typeof fetch)

        const request = client.getHotels()

        await expect(request).rejects.toBeInstanceOf(CloudbedsApiError)
        await expect(request).rejects.not.toThrow(config.apiKey)
    })

    it("requests reservation summaries without guest details", async () => {
        const fetcher = vi.fn<(input: URL, init: RequestInit) => Promise<Response>>(async () =>
            new Response(JSON.stringify({ success: true, data: [] }), { status: 200 }))
        const client = new CloudbedsClient(config, fetcher as typeof fetch)

        await client.getReservations({
            propertyId: "320211",
            checkInFrom: "2026-07-01",
            checkInTo: "2026-07-31",
        })

        const [url] = fetcher.mock.calls[0]
        expect(url.searchParams.get("propertyID")).toBe("320211")
        expect(url.searchParams.get("includeGuestsDetails")).toBe("false")
        expect(url.searchParams.get("includeAllRooms")).toBe("true")
        expect(url.searchParams.get("pageSize")).toBe("100")
    })
})
