import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import ical from 'ical-generator'
import { parseISO } from 'date-fns'

// Initialize Supabase Client (Admin context for reading all bookings)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Ideally Service Role, but Anon is okay if RLS allows public read or we are careful. 
// Note: For a public feed, we might need Service Role if RLS locks down bookings. 
// However, since this is a specific secure token access, we effectively authorise it.
// Let's use the env vars available.
const supabase = createClient(supabaseUrl, supabaseKey)

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> } // Next.js 15 params are promises
) {
    const { token } = await params

    if (!token) {
        return new NextResponse('Missing token', { status: 400 })
    }

    try {
        // 1. Find the Room by Token
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('id, location, label, type')
            .eq('ical_export_token', token)
            .single()

        if (roomError || !room) {
            return new NextResponse('Calendar not found', { status: 404 })
        }

        // 2. Fetch Bookings for this Room
        // We filter by room_type matching the room's ID or Type. 
        // In the current schema, room_type usually matches the room identifier.
        // We only want Active bookings.
        const { data: bookings, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('room_type', room.id) // Assuming room.id is the key used in bookings.room_type
            .in('status', ['confirmed', 'pending', 'checked_out']) // Include checked_out? Maybe not for future blocked dates, but fine for history.

        if (bookingError) {
            console.error('Error fetching bookings for iCal:', bookingError)
            return new NextResponse('Internal Server Error', { status: 500 })
        }

        // 3. Generate iCal Feed
        const calendar = ical({
            name: `Mandalas Hostal - ${room.label}`,
            timezone: 'America/Guatemala' // Should be dynamic or configured
        })

        if (bookings) {
            bookings.forEach((booking) => {
                const checkIn = parseISO(booking.check_in)
                const checkOut = parseISO(booking.check_out)

                calendar.createEvent({
                    start: checkIn,
                    end: checkOut,
                    summary: 'Reservado (Mandalas)', // Privacy: Don't show guest name
                    description: `Reserva interna #${booking.id.slice(0, 8)}`,
                    location: `${room.location} - ${room.label}`,
                    allDay: true // Hotel bookings are generally treated as All Day blocks in iCal for simplicity, or we can use 14:00 - 11:00 logic.
                    // "All Day" is safer for blocking dates in OTAs usually.
                })
            })
        }

        // 4. Return Response
        return new NextResponse(calendar.toString(), {
            headers: {
                'Content-Type': 'text/calendar; charset=utf-8',
                'Content-Disposition': `attachment; filename="mandalas-${room.id}.ics"`
            }
        })

    } catch (error) {
        console.error('iCal Generation Error:', error)
        return new NextResponse('Server Error', { status: 500 })
    }
}
