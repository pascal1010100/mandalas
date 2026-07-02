import type { CloudbedsConfig } from "./config"

export type CloudbedsResponse<T> = {
    success: boolean
    data: T
    message?: string
}

export class CloudbedsApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message)
        this.name = "CloudbedsApiError"
    }
}

export class CloudbedsClient {
    constructor(
        private readonly config: CloudbedsConfig,
        private readonly fetcher: typeof fetch = fetch,
    ) {}

    getHotels(): Promise<CloudbedsResponse<unknown>> {
        return this.get("getHotels")
    }

    getHotelDetails(propertyId: string): Promise<CloudbedsResponse<unknown>> {
        return this.get("getHotelDetails", { propertyID: propertyId })
    }

    getRooms(propertyId: string): Promise<CloudbedsResponse<unknown>> {
        return this.get("getRooms", { propertyIDs: propertyId })
    }

    getReservations(params: {
        propertyId: string
        checkInFrom: string
        checkInTo: string
        pageNumber?: number
        pageSize?: number
    }): Promise<CloudbedsResponse<unknown>> {
        return this.get("getReservations", {
            propertyID: params.propertyId,
            checkInFrom: params.checkInFrom,
            checkInTo: params.checkInTo,
            includeGuestsDetails: "false",
            includeAllRooms: "true",
            pageNumber: String(params.pageNumber || 1),
            pageSize: String(params.pageSize || 100),
        })
    }

    private async get<T>(endpoint: string, query?: Record<string, string>): Promise<CloudbedsResponse<T>> {
        const url = new URL(`${this.config.baseUrl}/${endpoint}`)

        for (const [key, value] of Object.entries(query || {})) {
            url.searchParams.set(key, value)
        }

        const controller = new AbortController()
        let timeout: ReturnType<typeof setTimeout> | undefined

        try {
            const request = this.fetcher(url, {
                    method: "GET",
                    cache: "no-store",
                    headers: {
                        accept: "application/json",
                        "x-api-key": this.config.apiKey,
                    },
                    signal: controller.signal,
                })
            const timeoutRequest = new Promise<never>((_, reject) => {
                timeout = setTimeout(() => {
                    controller.abort()
                    reject(new CloudbedsApiError("Cloudbeds request timed out", 504))
                }, 12_000)
            })
            const response = await Promise.race([request, timeoutRequest])

            const payload = await response.json().catch(() => null) as CloudbedsResponse<T> | null

            if (!response.ok) {
                throw new CloudbedsApiError(
                    payload?.message || `Cloudbeds request failed with status ${response.status}`,
                    response.status,
                )
            }

            if (!payload || payload.success === false) {
                throw new CloudbedsApiError(payload?.message || "Cloudbeds returned an unsuccessful response", response.status)
            }

            return payload
        } finally {
            if (timeout) clearTimeout(timeout)
        }
    }
}
