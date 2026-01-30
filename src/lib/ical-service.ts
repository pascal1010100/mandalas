import ical from 'node-ical'
import { isBefore, startOfDay } from 'date-fns'

// Use admin context or service role if possible, but for MVP client context with RLS policies (or public if admin)
// Since this runs on server (API route), better to use service role if available for unlimited access?
// We will use the standard env vars for now. If we need Admin privileges to write bookings, we need SERVICE_ROLE_KEY.
// Check if we have it? Usually NEXT_PUBLIC_SUPABASE_ANON_KEY is for client.
// We should check process.env.SUPABASE_SERVICE_ROLE_KEY.
import { supabaseAdmin } from "@/lib/supabase-admin"

const supabase = supabaseAdmin

export async function syncRoomImport(roomId: string, importUrl: string) {
    if (!importUrl) return { success: false, error: 'No URL provided' }

    try {
        // console.log(`Syncing room ${roomId} from ${importUrl}...`)

        // 1. Fetch and Parse iCal
        const events = await ical.async.fromURL(importUrl)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validEvents = Object.values(events).filter((event: any) =>
            event.type === 'VEVENT' && event.start && event.end
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ) as any[]

        // console.log(`Found ${validEvents.length} events. Processing...`)

        const now = startOfDay(new Date())
        const importedBookings = []

        const currentExternalIds = new Set<string>();

        const { error: deleteError } = await supabase
            .from('bookings')
            .update({ status: 'cancelled', cancellation_reason: 'Removed from external calendar' })
            .eq('source', 'ical')
            .eq('room_type', roomId)
            .neq('status', 'cancelled'); // Don't re-cancel

        // This logic is tricky with UPSERT below. 
        // We should first UPSERT all valid events, then find any 'ical' booking for this room NOT in the new list.

        // BETTER APPROACH:
        // 1. Process all events from feed.
        for (const event of validEvents) {
            if (isBefore(new Date(event.end), now)) continue;

            const externalId = event.uid;
            currentExternalIds.add(externalId);

            const payload = {
                guest_name: `Import: ${event.summary || 'Reserva Externa'}`,
                email: 'ota@sync.com',
                location: roomId.includes('pueblo') ? 'pueblo' : 'hideout',
                room_type: roomId, // This assumes 1-to-1 mapping. For dorms, we need Bed Logic? iCal usually blocks WHOLE dorm or specific unit. Assuming Room Level for now.
                guests: '1',
                check_in: event.start.toISOString(),
                check_out: event.end.toISOString(),
                status: 'confirmed',
                total_price: 0,
                external_id: externalId,
                source: 'ical',
                payment_status: 'paid', // External bookings are not debt in this system
            };

            const { error } = await supabase
                .from('bookings')
                .upsert(payload, { onConflict: 'external_id' });

            if (error) console.error(`Error Upserting ${externalId}:`, error);
        }

        // 2. Cancel bookings NOT in feed
        // Convert Set to Array for NOT IN query
        // Supabase limit might be an issue if 1000s events. For a hostel room, usually < 100 active.
        const activeIds = Array.from(currentExternalIds);

        if (activeIds.length > 0) {
            const { error: cancelError } = await supabase
                .from('bookings')
                .update({ status: 'cancelled', cancellation_reason: 'Sync: Removed from Source' })
                .eq('source', 'ical')
                .eq('room_type', roomId)
                .neq('status', 'cancelled')
                .not('external_id', 'in', `(${activeIds.join(',')})`);
            // NOTE: 'in' syntax with array might need adjustment or use separate query logic.
            // Supabase .in() takes an array.

            await supabase
                .from('bookings')
                .update({ status: 'cancelled', cancellation_reason: 'Sync: Removed from Source' })
                .eq('source', 'ical')
                .eq('room_type', roomId)
                .neq('status', 'cancelled')
                .filter('external_id', 'not.in', `(${activeIds.map(id => `"${id}"`).join(',')})`) // Hacky syntax check
        }

        // Correct Supabase usage for NOT IN:
        // .not('external_id', 'in', activeIds) -- this creates a huge query URL.
        // Alternative: Fetch ALL ical bookings for this room, iterate and cancel.

        const { data: existingBookings } = await supabase
            .from('bookings')
            .select('id, external_id')
            .eq('source', 'ical')
            .eq('room_type', roomId)
            .neq('status', 'cancelled');

        if (existingBookings) {
            const toCancel = existingBookings.filter(b => !currentExternalIds.has(b.external_id));
            if (toCancel.length > 0) {
                // console.log(`Cancelling ${toCancel.length} orphaned bookings`);
                await supabase
                    .from('bookings')
                    .update({ status: 'cancelled', cancellation_reason: 'Sync: Removed from Source' })
                    .in('id', toCancel.map(b => b.id));
            }
        }

        return { success: true, count: importedBookings.length, rawCount: validEvents.length }

    } catch (error) {
        console.error('Sync Error:', error)
        return { success: false, error: String(error) }
    }
}
