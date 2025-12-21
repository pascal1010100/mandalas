import ical from 'node-ical'
import { createClient } from '@supabase/supabase-js'
import { isBefore, startOfDay } from 'date-fns'

// Use admin context or service role if possible, but for MVP client context with RLS policies (or public if admin)
// Since this runs on server (API route), better to use service role if available for unlimited access?
// We will use the standard env vars for now. If we need Admin privileges to write bookings, we need SERVICE_ROLE_KEY.
// Check if we have it? Usually NEXT_PUBLIC_SUPABASE_ANON_KEY is for client.
// We should check process.env.SUPABASE_SERVICE_ROLE_KEY.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function syncRoomImport(roomId: string, importUrl: string) {
    if (!importUrl) return { success: false, error: 'No URL provided' }

    try {
        console.log(`Syncing room ${roomId} from ${importUrl}...`)

        // 1. Fetch and Parse iCal
        const events = await ical.async.fromURL(importUrl)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validEvents = Object.values(events).filter((event: any) =>
            event.type === 'VEVENT' && event.start && event.end
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any[]

        console.log(`Found ${validEvents.length} events. Processing...`)

        const now = startOfDay(new Date())
        const importedBookings = []

        for (const event of validEvents) {
            // Skip old events (optional, but good for performance)
            if (isBefore(new Date(event.end), now)) continue;

            // Map to Booking Structure
            // iCal UIDs are weird. We use them as external_id.
            const externalId = event.uid
            const start = event.start
            const end = event.end
            const summary = event.summary || 'Reserva Externa'

            // Check if this booking deals with "Cancelled"?
            // iCal usually just removes the event. If it removes it, we might need to "clean up" orphaned external bookings.
            // Complex. For MVP, we just UPSERT content. Deletion is harder (requires fetching all external, diffing).
            // Let's stick to UPSERT for now.

            const payload = {
                guest_name: `Import: ${summary}`,
                email: 'ota@sync.com', // Placeholder
                location: roomId.includes('pueblo') ? 'pueblo' : 'hideout', // Derive from room ID?
                room_type: roomId,
                guests: '1', // Assumption
                check_in: start.toISOString(),
                check_out: end.toISOString(),
                status: 'confirmed',
                total_price: 0, // External bookings don't track our price usually
                external_id: externalId,
                source: 'ical'
            }

            // Upsert based on external_id
            const { data, error } = await supabase
                .from('bookings')
                .upsert(payload, { onConflict: 'external_id' })
                .select()

            if (error) {
                console.error(`Error syncing event ${externalId}:`, error)
            } else {
                if (data) importedBookings.push(data[0])
            }
        }

        return { success: true, count: importedBookings.length, rawCount: validEvents.length }

    } catch (error) {
        console.error('Sync Error:', error)
        return { success: false, error: String(error) }
    }
}
