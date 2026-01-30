
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugBookings() {
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .or('guest_name.ilike.%Peter%,guest_name.ilike.%Sofia%,guest_name.ilike.%Sophia%')

    if (error) {
        console.error("Error:", error)
        return
    }

    console.log("--- FOUND BOOKINGS ---")
    data.forEach(b => {
        console.log({
            id: b.id,
            guest: b.guest_name,
            room_type: b.room_type,
            location: b.location,
            unit_id: b.unit_id,
            status: b.status,
            dates: `${b.check_in} -> ${b.check_out}`
        })
    })
}

debugBookings()
