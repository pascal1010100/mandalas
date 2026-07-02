import { NextResponse } from "next/server"
import { generateMorningBrief } from "@/infrastructure/cloudbeds/morning-brief"

export const dynamic = "force-dynamic"

export async function GET() {
    try {
        const brief = await generateMorningBrief()
        return NextResponse.json({ success: true, data: brief })
    } catch (error) {
        const message = error instanceof Error ? error.message : "No fue posible consultar Cloudbeds"
        return NextResponse.json({ success: false, message }, { status: 502 })
    }
}
