import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { syncRoomImport } from '@/lib/ical-service'

// Admin/Service context to allow writing bookings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
    try {
        const { roomId } = await request.json()

        if (!roomId) {
            return new NextResponse('Missing roomId', { status: 400 })
        }

        // 1. Get the Import URL for this room
        const { data: room, error } = await supabase
            .from('rooms')
            .select('ical_import_url')
            .eq('id', roomId)
            .single()

        if (error || !room || !room.ical_import_url) {
            return new NextResponse('Room has no Import URL configured', { status: 400 })
        }

        // 2. Run Sync Service
        const result = await syncRoomImport(roomId, room.ical_import_url)

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
