
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { format } from 'date-fns'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

// Logic from RoomStatusGrid
const resolveCanonicalRoomId = (bookingType: string, bookingLocation: string): string | null => {
    const type = bookingType?.toLowerCase().replace(/[^a-z0-9]/g, '') || ''
    const loc = bookingLocation?.toLowerCase().trim() || ''

    if (loc === 'pueblo') {
        if (type === 'room101' || type === '101') return 'pueblo_private_1'
        if (type === 'room102' || type === '102') return 'pueblo_private_2'
        if (type === 'dorm1' || type === 'mixed' || type === 'dorm') return 'pueblo_dorm_mixed_8'
        if (type === 'dorm2' || type === 'female') return 'pueblo_dorm_female_6'
        if (type === 'suite1' || type === 'suite') return 'pueblo_suite_balcony'
        if (type === 'family') return 'pueblo_private_family'
    }

    if (loc === 'hideout') {
        if (type === 'dorm1' || type === 'mixed' || type === 'dorm' || type === 'hideoutdormmixed') return 'hideout_dorm_mixed'
        if (type === 'dorm2' || type === 'female' || type === 'hideoutdormfemale') return 'hideout_dorm_female'
        if (type === 'room1' || type === 'private') return 'hideout_private'
    }

    return null
}

async function runTest() {
    console.log("--- SIMULATING GRID LOGIC ---")

    // 1. Fetch Data
    const { data: rooms } = await supabase.from('rooms').select('*')
    const { data: bookings } = await supabase.from('bookings').select('*').ilike('guest_name', '%phelipa%')

    if (!rooms || !bookings) { console.log('Data missing'); return }

    console.log(`Loaded ${rooms.length} rooms.`)
    const phelipa = bookings[0]
    console.log("Booking:", phelipa.room_type, phelipa.unit_id)

    // 2. Build Map
    const activeBookingsByRoom = new Map<string, any[]>()

    // Simulate Mapping Logic
    const b = phelipa
    const rawStatus = b.status?.toLowerCase().trim() || 'pending'

    // Check if room exists
    const isDirectMatch = rooms.some(r => r.id === b.room_type)
    let targetId = b.room_type

    if (!isDirectMatch) {
        console.log("Direct match FAILED for:", b.room_type)
        targetId = resolveCanonicalRoomId(b.room_type, b.location) || b.room_type
        console.log("Resolved to:", targetId)
    } else {
        console.log("Direct match SUCCESS for:", b.room_type)
    }

    if (!activeBookingsByRoom.has(targetId)) activeBookingsByRoom.set(targetId, [])
    activeBookingsByRoom.get(targetId)?.push(b)

    // 3. Grid Assignment Logic
    const targetRoom = rooms.find(r => r.id === targetId)
    if (!targetRoom) {
        console.log("CRITICAL: Room not found in list:", targetId)
        return
    }

    const activeBookings = activeBookingsByRoom.get(targetRoom.id) || []
    const isDorm = targetRoom.type === 'dorm'
    const gridSlots = isDorm ? targetRoom.capacity : 1

    const units = Array.from({ length: gridSlots }, (_, i) => ({
        id: `${targetRoom.id}-${i}`,
        unitId: (i + 1).toString(),
        booking: undefined as any
    }))

    const unassignedBookings: any[] = []

    activeBookings.forEach(booking => {
        if (isDorm) {
            console.log("Processing Dorm Assignment. UnitID:", booking.unit_id)
            if (booking.unit_id && !isNaN(parseInt(booking.unit_id))) {
                const index = parseInt(booking.unit_id) - 1
                if (index >= 0 && index < gridSlots) {
                    units[index].booking = booking
                    console.log(`Assigned to Index ${index} (Bed ${index + 1})`)
                } else {
                    unassignedBookings.push(booking)
                    console.log("Index out of bounds")
                }
            } else {
                unassignedBookings.push(booking)
                console.log("Invalid Unit ID")
            }
        }
    })

    // 4. Orphaned Check
    const allDisplayed = new Set<string>()
    units.forEach(u => u.booking && allDisplayed.add(u.booking.id))
    unassignedBookings.forEach(b => allDisplayed.add(b.id))

    if (!allDisplayed.has(phelipa.id)) {
        console.log("RESULT: ORPHANED (WARNING WOULD SHOW)")
    } else {
        console.log("RESULT: ASSIGNED/DISPLAYED (NO WARNING)")
    }
}

runTest()
