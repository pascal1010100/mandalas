import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
    const receiverConfigured = Boolean(
        process.env.CLOUDBEDS_WEBHOOK_SECRET?.trim()
        && process.env.CLOUDBEDS_HIDEOUT_PROPERTY_ID?.trim(),
    )
    const channelConfigured = Boolean(
        process.env.TELEGRAM_BOT_TOKEN?.trim()
        && process.env.TELEGRAM_CHAT_ID?.trim(),
    )
    const publicUrlConfigured = Boolean(
        process.env.NEXT_PUBLIC_SITE_URL?.trim()
        || process.env.VERCEL_URL?.trim(),
    )

    return NextResponse.json({
        success: true,
        data: {
            receiverConfigured,
            channelConfigured,
            publicUrlConfigured,
            ready: receiverConfigured && channelConfigured && publicUrlConfigured,
        },
    })
}
