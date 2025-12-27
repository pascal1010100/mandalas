import { NextRequest, NextResponse } from 'next/server'
import { syncRoomImport } from '@/lib/ical-service'

import { supabaseAdmin } from "@/lib/supabase-admin"

const supabase = supabaseAdmin

export async function POST(request: NextRequest) {
    try {
        const { roomId, importUrl: explicitUrl } = await request.json()

        if (!roomId) {
            return new NextResponse('Missing roomId', { status: 400 })
        }

        let urlToUse = explicitUrl

        if (!urlToUse) {
            // 1. Get the Import URL from DB if not provided
            const { data: room, error } = await supabase
                .from('rooms')
                .select('ical_import_url')
                .eq('id', roomId)
                .single()

            if (error || !room || !room.ical_import_url) {
                return new NextResponse('Room has no Import URL configured', { status: 400 })
            }
            urlToUse = room.ical_import_url
        }

        // 2. Run Sync Service
        const result = await syncRoomImport(roomId, urlToUse)

        if (!result.success) {
            return new NextResponse(`Sync Failed: ${result.error}`, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            imported: result.count,
            message: `Sincronizados ${result.count} eventos externos`
        })

    } catch (error) {
        console.error('Sync API Error:', error)
        return new NextResponse('Server Error', { status: 500 })
    }
}
