
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDormBooking() {
    console.log("TEST: Creating Dorm Booking for Bed 5...")

    const testGuest = `Test Guest ${Date.now()}`
    const roomId = 'pueblo_dorm_mixed_8'
    const targetUnit = '5'

    // 1. Create Booking
    const payload = {
        guest_name: testGuest,
        email: 'test@example.com',
        location: 'pueblo',
        room_type: roomId,
        guests: '1',
        check_in: new Date().toISOString().split('T')[0],
        check_out: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        status: 'confirmed',
        total_price: 10,
        unit_id: targetUnit // SPECIFIC UNIT
    }

    const { data, error } = await supabase.from('bookings').insert([payload]).select().single()

    if (error) {
        console.error("Insert Error:", error)
        return
    }

    console.log(`Booking Created ID: ${data.id}`)
    console.log(`Requested Unit: ${targetUnit}`)
    console.log(`Saved Unit: ${data.unit_id}`)

    if (data.unit_id === targetUnit) {
        console.log("✅ SUCCESS: Unit ID persisted correctly.")
    } else {
        console.error(`❌ FAILURE: Unit ID mismatch. Expected ${targetUnit}, got ${data.unit_id}`)
    }

    // Clean up
    await supabase.from('bookings').delete().eq('id', data.id)
}

testDormBooking()
