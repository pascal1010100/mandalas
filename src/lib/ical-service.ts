import ical from 'node-ical'
import { isBefore, startOfDay, isValid } from 'date-fns'
import { supabaseAdmin } from "@/lib/supabase-admin"

const supabase = supabaseAdmin

interface SyncResult {
    success: boolean
    count: number
    rawCount: number
    processed: number
    errors: string[]
    warnings: string[]
    duration: number
}

interface RoomSyncStats {
    roomId: string
    imported: number
    cancelled: number
    errors: number
    duration: number
}

export async function syncRoomImport(roomId: string, importUrl: string): Promise<SyncResult> {
    const startTime = Date.now()
    const result: SyncResult = {
        success: false,
        count: 0,
        rawCount: 0,
        processed: 0,
        errors: [],
        warnings: [],
        duration: 0
    }

    try {
        // Validate inputs
        if (!roomId) {
            result.errors.push("Room ID is required")
            return result
        }

        if (!importUrl) {
            result.errors.push("Import URL is required")
            return result
        }

        // Validate URL format
        try {
            new URL(importUrl)
        } catch {
            result.errors.push("Invalid URL format")
            return result
        }

        console.log(`🔄 Starting iCal sync for room ${roomId} from ${importUrl}`)

        // 1. Fetch and Parse iCal
        let events
        try {
            events = await ical.async.fromURL(importUrl)
            console.log(`📥 Fetched iCal feed from ${importUrl}`)
        } catch (fetchError) {
            result.errors.push(`Failed to fetch iCal: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`)
            return result
        }

        // 2. Validate and filter events
        const validEvents = Object.values(events).filter((event: any) => {
            if (event.type !== 'VEVENT') return false
            if (!event.start || !event.end) return false
            
            // Validate dates
            const startDate = new Date(event.start)
            const endDate = new Date(event.end)
            
            if (!isValid(startDate) || !isValid(endDate)) {
                result.warnings.push(`Invalid dates for event: ${event.summary || 'Unknown'}`)
                return false
            }

            // Skip past events
            if (isBefore(endDate, startOfDay(new Date()))) {
                return false
            }

            return true
        }) as any[]

        result.rawCount = Object.values(events).length
        result.processed = validEvents.length

        console.log(`📊 Processed ${validEvents.length} valid events out of ${result.rawCount} total`)

        if (validEvents.length === 0) {
            result.warnings.push("No valid events found in iCal feed")
            result.success = true
            result.duration = Date.now() - startTime
            return result
        }

        // 3. Get existing bookings for this room
        const { data: existingBookings, error: fetchError } = await supabase
            .from('bookings')
            .select('id, external_id, status')
            .eq('source', 'ical')
            .eq('room_type', roomId)
            .neq('status', 'cancelled')

        if (fetchError) {
            result.errors.push(`Failed to fetch existing bookings: ${fetchError.message}`)
            return result
        }

        const existingBookingsMap = new Map(
            existingBookings?.map(booking => [booking.external_id, booking]) || []
        )

        console.log(`📋 Found ${existingBookingsMap.size} existing active bookings`)

        // 4. Process events and upsert bookings
        const currentExternalIds = new Set<string>()
        let importedCount = 0

        for (const event of validEvents) {
            try {
                const externalId = event.uid || `generated-${Date.now()}-${Math.random()}`
                currentExternalIds.add(externalId)

                const startDate = new Date(event.start)
                const endDate = new Date(event.end)

                // Validate date range
                if (isBefore(endDate, startDate)) {
                    result.warnings.push(`Invalid date range for event: ${event.summary || 'Unknown'}`)
                    continue
                }

                const payload = {
                    guest_name: `Import: ${event.summary || 'Reserva Externa'}`,
                    email: 'ota@sync.com',
                    location: roomId.includes('pueblo') ? 'pueblo' : 'hideout',
                    room_type: roomId,
                    guests: '1',
                    check_in: startDate.toISOString(),
                    check_out: endDate.toISOString(),
                    status: 'confirmed',
                    total_price: 0,
                    external_id: externalId,
                    source: 'ical',
                    payment_status: 'paid',
                    updated_at: new Date().toISOString()
                }

                const { error: upsertError } = await supabase
                    .from('bookings')
                    .upsert(payload, { onConflict: 'external_id' })

                if (upsertError) {
                    result.errors.push(`Failed to upsert booking ${externalId}: ${upsertError.message}`)
                } else {
                    importedCount++
                    // Remove from existing map to track which ones are still active
                    existingBookingsMap.delete(externalId)
                }

            } catch (eventError) {
                result.errors.push(`Failed to process event: ${eventError instanceof Error ? eventError.message : 'Unknown error'}`)
            }
        }

        // 5. Cancel bookings that are no longer in the feed
        const bookingsToCancel = Array.from(existingBookingsMap.values())
        let cancelledCount = 0

        if (bookingsToCancel.length > 0) {
            console.log(`🗑️ Cancelling ${bookingsToCancel.length} bookings no longer in feed`)

            const { error: cancelError } = await supabase
                .from('bookings')
                .update({ 
                    status: 'cancelled', 
                    cancellation_reason: 'Sync: Removed from Source',
                    updated_at: new Date().toISOString()
                })
                .in('id', bookingsToCancel.map(b => b.id))

            if (cancelError) {
                result.errors.push(`Failed to cancel bookings: ${cancelError.message}`)
            } else {
                cancelledCount = bookingsToCancel.length
            }
        }

        // 6. Final result
        result.success = true
        result.count = importedCount
        result.duration = Date.now() - startTime

        console.log(`✅ Sync completed: ${importedCount} imported, ${cancelledCount} cancelled, ${result.duration}ms`)

        return result

    } catch (error) {
        console.error('❌ Critical sync error:', error)
        result.errors.push(`Critical error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        result.duration = Date.now() - startTime
        return result
    }
}

// New function for batch sync
export async function syncMultipleRooms(roomConfigs: Array<{ roomId: string; importUrl: string }>) {
    const results: Array<{ roomId: string; result: SyncResult }> = []
    
    for (const config of roomConfigs) {
        console.log(`🔄 Starting sync for room ${config.roomId}`)
        const result = await syncRoomImport(config.roomId, config.importUrl)
        results.push({ roomId: config.roomId, result })
        
        // Add delay between syncs to avoid overwhelming external services
        if (config !== roomConfigs[roomConfigs.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 1000))
        }
    }
    
    return results
}

// New function to validate iCal URL before sync
export async function validateIcalUrl(url: string): Promise<{ valid: boolean; error?: string; eventCount?: number }> {
    try {
        // Validate URL format
        new URL(url)
        
        // Try to fetch and parse a small sample
        const events = await ical.async.fromURL(url)
        const eventCount = Object.values(events).filter((event: any) => event.type === 'VEVENT').length
        
        return { valid: true, eventCount }
    } catch (error) {
        return { 
            valid: false, 
            error: error instanceof Error ? error.message : 'Invalid URL or feed' 
        }
    }
}
