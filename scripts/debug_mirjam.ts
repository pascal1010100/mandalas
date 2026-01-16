
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function debugMirjam() {
    console.log("Searching for Mirjam...")
    const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .ilike('guest_name', '%Mirjam%')

    if (error) {
        console.error("Error:", error)
        return
    }

    console.log(`Found ${data.length} bookings for Mirjam:`)
    data.forEach(b => {
        console.log({
            id: b.id,
            guest: b.guest_name,
            room: b.room_type,
            unit: b.unit_id,
            guests: b.guests,
            status: b.status,
            check_in: b.check_in,
            check_out: b.check_out,
            created: b.created_at
        })
    })
}

debugMirjam()
