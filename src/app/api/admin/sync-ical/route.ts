import { NextRequest, NextResponse } from 'next/server'
import { syncRoomImport, validateIcalUrl } from '@/lib/ical-service'
import { supabaseAdmin } from "@/lib/supabase-admin"

const supabase = supabaseAdmin

export async function POST(request: NextRequest) {
    try {
        const { roomId, importUrl: explicitUrl, validateOnly = false } = await request.json()

        if (!roomId) {
            return NextResponse.json(
                { success: false, error: 'Room ID is required' },
                { status: 400 }
            )
        }

        let urlToUse = explicitUrl

        if (!urlToUse) {
            // Get the Import URL from DB if not provided
            const { data: room, error } = await supabase
                .from('rooms')
                .select('ical_import_url, label')
                .eq('id', roomId)
                .single()

            if (error || !room || !room.ical_import_url) {
                return NextResponse.json(
                    { success: false, error: 'Room has no Import URL configured' },
                    { status: 400 }
                )
            }
            urlToUse = room.ical_import_url
        }

        // Optional validation before sync
        if (validateOnly) {
            const validation = await validateIcalUrl(urlToUse)
            return NextResponse.json({
                success: validation.valid,
                validation: {
                    valid: validation.valid,
                    error: validation.error,
                    eventCount: validation.eventCount
                }
            })
        }

        // Run Sync Service
        const result = await syncRoomImport(roomId, urlToUse)

        if (!result.success) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Sync failed',
                    details: result.errors,
                    duration: result.duration
                },
                { status: 500 }
            )
        }

        // Log successful sync for analytics
        console.log(`📈 Sync analytics: Room ${roomId}, ${result.count} imported, ${result.duration}ms`)

        return NextResponse.json({
            success: true,
            data: {
                imported: result.count,
                processed: result.processed,
                rawCount: result.rawCount,
                duration: result.duration,
                warnings: result.warnings,
                errors: result.errors.length > 0 ? result.errors : undefined
            },
            message: result.warnings.length > 0 
                ? `Sincronizados ${result.count} eventos con ${result.warnings.length} advertencias`
                : `Sincronizados ${result.count} eventos exitosamente`
        })

    } catch (error) {
        console.error('❌ Sync API Error:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Add GET endpoint for sync status
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const roomId = searchParams.get('roomId')

        if (!roomId) {
            return NextResponse.json(
                { success: false, error: 'Room ID is required' },
                { status: 400 }
            )
        }

        // Get recent sync activity for this room
        const { data: recentBookings, error } = await supabase
            .from('bookings')
            .select('id, external_id, status, created_at, updated_at, cancellation_reason')
            .eq('room_type', roomId)
            .eq('source', 'ical')
            .order('updated_at', { ascending: false })
            .limit(10)

        if (error) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch sync status' },
                { status: 500 }
            )
        }

        const stats = {
            total: recentBookings?.length || 0,
            active: recentBookings?.filter(b => b.status === 'confirmed').length || 0,
            cancelled: recentBookings?.filter(b => b.status === 'cancelled').length || 0,
            lastSync: recentBookings?.[0]?.updated_at || null,
            recentActivity: recentBookings || []
        }

        return NextResponse.json({
            success: true,
            data: stats
        })

    } catch (error) {
        console.error('❌ Sync Status API Error:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
