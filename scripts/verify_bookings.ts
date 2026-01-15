
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyBookings() {
    console.log('--- Verifying Bookings (RLS Check) ---')
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .or(`check_in.eq.${todayStr},check_out.eq.${todayStr},status.eq.checked_in`)

    if (error) {
        console.error('Error fetching bookings:', error)
        return
    }

    console.log(`Found ${bookings.length} relevant bookings. User ID Inspection:`)
    bookings.forEach(b => {
        // Check if user_id exists in the returned object (it might be undefined if column doesn't exist)

        console.log(`- [${b.status}] ${b.guest_name} | Unit: ${b.unit_id} | UserID: ${b.user_id}`)
    })
}

verifyBookings()
