export type CloudbedsProperty = "hideout" | "mandalas"

export type CloudbedsConfig = {
    apiKey: string
    baseUrl: string
    propertyId?: string
}

const API_KEY_ENV: Record<CloudbedsProperty, string> = {
    hideout: "CLOUDBEDS_HIDEOUT_API_KEY",
    mandalas: "CLOUDBEDS_MANDALAS_API_KEY",
}

const PROPERTY_ID_ENV: Record<CloudbedsProperty, string> = {
    hideout: "CLOUDBEDS_HIDEOUT_PROPERTY_ID",
    mandalas: "CLOUDBEDS_MANDALAS_PROPERTY_ID",
}

export function getCloudbedsConfig(property: CloudbedsProperty): CloudbedsConfig {
    if (typeof window !== "undefined") {
        throw new Error("Cloudbeds credentials can only be accessed on the server")
    }

    const apiKeyEnv = API_KEY_ENV[property]
    const apiKey = process.env[apiKeyEnv]?.trim()

    if (!apiKey) {
        throw new Error(`Missing server environment variable: ${apiKeyEnv}`)
    }

    return {
        apiKey,
        baseUrl: (process.env.CLOUDBEDS_API_BASE_URL || "https://api.cloudbeds.com/api/v1.3").replace(/\/$/, ""),
        propertyId: process.env[PROPERTY_ID_ENV[property]]?.trim() || undefined,
    }
}
