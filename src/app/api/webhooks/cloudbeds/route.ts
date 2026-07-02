import { timingSafeEqual } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { getCloudbedsConfig } from "@/infrastructure/cloudbeds/config"
import { buildCloudbedsAlert, sendCloudbedsAlert } from "@/infrastructure/cloudbeds/webhook-alert"
import { parseCloudbedsWebhook } from "@/infrastructure/cloudbeds/webhook-event"

export const dynamic = "force-dynamic"

const MAX_BODY_BYTES = 64 * 1024
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 90
const requestWindows = new Map<string, { count: number; resetAt: number }>()
const recentEvents = new Map<string, number>()
const DUPLICATE_WINDOW_MS = 10 * 60_000

function safeEqual(received: string, expected: string): boolean {
    const receivedBuffer = Buffer.from(received)
    const expectedBuffer = Buffer.from(expected)
    return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
}

function isRateLimited(request: NextRequest): boolean {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    const client = forwarded || "unknown"
    const now = Date.now()
    const current = requestWindows.get(client)
    if (!current || current.resetAt <= now) {
        requestWindows.set(client, { count: 1, resetAt: now + WINDOW_MS })
        return false
    }
    current.count += 1
    return current.count > MAX_REQUESTS_PER_WINDOW
}

function claimEvent(eventKey: string): boolean {
    const now = Date.now()
    if (recentEvents.size > 500) {
        for (const [key, expiresAt] of recentEvents) {
            if (expiresAt <= now) recentEvents.delete(key)
        }
    }
    const expiresAt = recentEvents.get(eventKey)
    if (expiresAt && expiresAt > now) return false
    recentEvents.set(eventKey, now + DUPLICATE_WINDOW_MS)
    return true
}

export async function POST(request: NextRequest) {
    if (isRateLimited(request)) {
        return NextResponse.json({ success: false }, { status: 429 })
    }

    const expectedSecret = process.env.CLOUDBEDS_WEBHOOK_SECRET?.trim()
    const receivedSecret = request.nextUrl.searchParams.get("token") || ""
    if (!expectedSecret || !safeEqual(receivedSecret, expectedSecret)) {
        return NextResponse.json({ success: false }, { status: 401 })
    }

    const rawBody = await request.text()
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
        return NextResponse.json({ success: false }, { status: 413 })
    }

    try {
        const event = parseCloudbedsWebhook(JSON.parse(rawBody))
        const hideoutPropertyId = getCloudbedsConfig("hideout").propertyId
        if (!hideoutPropertyId || event.propertyId !== hideoutPropertyId) {
            return NextResponse.json({ success: false }, { status: 403 })
        }

        if (!claimEvent(event.eventKey)) {
            return NextResponse.json({ success: true, accepted: false, duplicate: true })
        }

        try {
            const alert = buildCloudbedsAlert(event)
            await sendCloudbedsAlert(alert)
            return NextResponse.json({ success: true, accepted: true })
        } catch (error) {
            recentEvents.delete(event.eventKey)
            throw error
        }
    } catch (error) {
        const message = error instanceof SyntaxError ? "Invalid JSON" : error instanceof Error ? error.message : "Invalid webhook"
        const status = message.includes("not configured") || message.includes("Telegram") ? 503 : 422
        return NextResponse.json({ success: false, message }, { status })
    }
}
