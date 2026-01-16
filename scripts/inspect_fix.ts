
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function inspectBookings() {
    const ids = [
        '19dba577-58b1-4d1b-8dfb-178ed72ad9f7', // Sophia (Room 3)
        '73a22b2d-c3bd-4672-b25c-bd0934ab8eb6', // Peter (Room 4 - I cancelled this)
        'bbccc3ef-0629-4a39-afb7-8fa59fbb7b17'  // Peter Karrenbelt (Room 3)
    ]

    const { data } = await supabase
        .from('bookings')
        .select('*')
        .in('id', ids)

    console.log("--- DETAILS ---")
    data?.forEach(b => {
        console.log(`\nID: ${b.id}`)
        console.log(`Guest: ${b.guest_name}`)
        console.log(`Room: ${b.room_type}`)
        console.log(`Status: ${b.status}`)
        console.log(`Guests Count: ${b.guests}`)
        console.log(`Created: ${b.created_at}`)
    })
}

inspectBookings()
